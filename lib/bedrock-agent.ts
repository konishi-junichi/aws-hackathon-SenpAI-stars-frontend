import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore'
import { useCognitoAuth } from './amplify'

export const useBedrockAgent = () => {
  const { getCredentials } = useCognitoAuth()

  const sendMessage = async (message: string, sessionId: string = 'default-session-12345678901234567890123456789012345') => {
    try {
      const credentials = await getCredentials()
      
      const client = new BedrockAgentCoreClient({
        region: process.env.NEXT_PUBLIC_AWS_BEDROCK_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
        credentials
      })

      const command = new InvokeAgentRuntimeCommand({
        runtimeSessionId: sessionId.padEnd(33, '0'),
        agentRuntimeArn: process.env.NEXT_PUBLIC_COMMUNICATION_AGENT_ARN,
        qualifier: 'DEFAULT',
        payload: new TextEncoder().encode(JSON.stringify({ prompt: message }))
      })

      const response = await client.send(command)
      const textResponse = await response.response?.transformToString()
      
      return textResponse || 'Sorry, I could not process your request.'
    } catch (error) {
      console.error('Bedrock Agent error:', error)
      return 'Sorry, there was an error connecting to the AI agent.'
    }
  }

  return { sendMessage }
}