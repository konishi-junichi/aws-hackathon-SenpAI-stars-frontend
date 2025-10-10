import { useState, useEffect } from 'react'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!
})

export const useCognitoAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const signIn = async (username: string, password: string) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool })
      const authDetails = new AuthenticationDetails({ Username: username, Password: password })
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const userData = { 
            username, 
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken()
          }
          setUser(userData)
          localStorage.setItem('cognitoUser', JSON.stringify(userData))
          resolve(result)
        },
        onFailure: (err) => reject(err)
      })
    })
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('cognitoUser')
  }

  const getCredentials = () => {
    const token = user?.idToken || user?.token
    if (!token) throw new Error('No authentication token')
    return fromCognitoIdentityPool({
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
      logins: {
        [`cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`]: token
      },
      clientConfig: { region: process.env.NEXT_PUBLIC_AWS_REGION! }
    })
  }

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('cognitoUser')
        if (stored) {
          const userData = JSON.parse(stored)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking stored auth:', error)
        localStorage.removeItem('cognitoUser')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  return { user, loading, signIn, signOut, getCredentials }
}