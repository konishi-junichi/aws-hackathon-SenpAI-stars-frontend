import { useState, useEffect, useRef } from 'react'
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore'
import { useCognitoAuth } from '../lib/amplify'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastMessage: Date
}

export default function ChatApp() {
  const { getCredentials } = useCognitoAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [editingConversation, setEditingConversation] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, currentConversation])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新しい会話',
      messages: [],
      lastMessage: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversation(newConversation.id)
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    let conversationId = currentConversation
    let isNewConversation = false
    
    if (!conversationId) {
      conversationId = Date.now().toString()
      isNewConversation = true
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    const autoTitle = message.trim().length > 20 
      ? message.trim().substring(0, 20) + '...'
      : message.trim()

    if (isNewConversation) {
      const newConversation: Conversation = {
        id: conversationId,
        title: autoTitle,
        messages: [userMessage],
        lastMessage: new Date()
      }
      
      setConversations(prev => [newConversation, ...prev])
      setCurrentConversation(conversationId)
    } else {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const isFirstMessage = conv.messages.length === 0
          const shouldUpdateTitle = isFirstMessage || conv.title === '新しい会話'
          
          return {
            ...conv,
            title: shouldUpdateTitle ? autoTitle : conv.title,
            messages: [...conv.messages, userMessage],
            lastMessage: new Date()
          }
        }
        return conv
      }))
    }

    setMessage('')

    // Get AI response from Bedrock Agent
    try {
      const client = new BedrockAgentCoreClient({
        region: process.env.NEXT_PUBLIC_AWS_BEDROCK_REGION || 'us-east-1',
        credentials: getCredentials()
      })
      
      const input = {
        runtimeSessionId: `session-${conversationId}-${Date.now()}`,
        agentRuntimeArn: process.env.NEXT_PUBLIC_BEDROCK_AGENT_ARN || '',
        qualifier: 'DEFAULT',
        payload: new TextEncoder().encode(JSON.stringify({ prompt: message }))
      }

      const command = new InvokeAgentRuntimeCommand(input)
      const response = await client.send(command)
      const textResponse = await response.response?.transformToString() || 'すみません、応答を取得できませんでした。'

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: textResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, aiMessage], lastMessage: new Date() }
          : conv
      ))
    } catch (error) {
      console.error('AI応答エラー:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'すみません、AIからの応答を取得できませんでした。もう一度お試しください。',
        sender: 'ai',
        timestamp: new Date()
      }

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, errorMessage], lastMessage: new Date() }
          : conv
      ))
    }
  }

  const startEditingTitle = (conversationId: string, currentTitle: string) => {
    setEditingConversation(conversationId)
    setEditingTitle(currentTitle)
  }

  const saveTitle = () => {
    if (!editingConversation || !editingTitle.trim()) return
    
    setConversations(prev => prev.map(conv => 
      conv.id === editingConversation 
        ? { ...conv, title: editingTitle.trim() }
        : conv
    ))
    
    setEditingConversation(null)
    setEditingTitle('')
  }

  const cancelEditing = () => {
    setEditingConversation(null)
    setEditingTitle('')
  }

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('音声認識がサポートされていません')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'ja-JP'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
    }

    recognition.start()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const currentMessages = currentConversation 
    ? conversations.find(conv => conv.id === currentConversation)?.messages || []
    : []

  return (
    <div className="chat-container">
      <div className={`sidebar ${!sidebarVisible ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <input
            type="text"
            placeholder="会話を検索..."
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="conversation-list">
          <button className="btn" onClick={createNewConversation} style={{width: '100%', marginBottom: '1rem'}}>
            新しい会話
          </button>
          {filteredConversations.map(conv => (
            <div key={conv.id} className="conversation-item">
              {editingConversation === conv.id ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveTitle()}
                    onKeyDown={(e) => e.key === 'Escape' && cancelEditing()}
                    className="input-field"
                    style={{fontSize: '0.9rem', padding: '0.25rem'}}
                    autoFocus
                  />
                  <div style={{display: 'flex', gap: '0.25rem'}}>
                    <button onClick={saveTitle} className="btn" style={{fontSize: '0.7rem', padding: '0.25rem 0.5rem'}}>保存</button>
                    <button onClick={cancelEditing} className="btn-icon" style={{fontSize: '0.7rem', padding: '0.25rem 0.5rem'}}>キャンセル</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setCurrentConversation(conv.id)} style={{cursor: 'pointer', flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>{conv.title}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditingTitle(conv.id, conv.title)
                      }}
                      className="btn-icon"
                      style={{fontSize: '0.7rem', padding: '0.25rem'}}
                    >
                      ✏️
                    </button>
                  </div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                    {conv.lastMessage.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="main-chat">
        <div className="chat-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button 
              className="btn-icon"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              ☰
            </button>
            <h2>SenpAI Chat</h2>
          </div>
          <button 
            className="btn-icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="chat-messages">
          {currentMessages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            className="input-field"
            placeholder="メッセージを入力... (Shift+Enterで改行)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            rows={1}
            style={{resize: 'none', minHeight: '2.5rem'}}
          />
          <button 
            className={`btn voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={startVoiceRecording}
          >
            🎤
          </button>
          <button className="btn" onClick={sendMessage}>
            送信
          </button>
        </div>
      </div>
    </div>
  )
}