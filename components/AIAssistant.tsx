'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm Vraj's AI assistant. I've analyzed his portfolio, LinkedIn, resume, and Twitter. Ask me anything about his design work, experience, or what he can help you with!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    "What can Vraj do in terms of Design?",
    "Tell me about his experience at Luma",
    "What's his design process like?",
    "Show me his recent projects",
    "What makes his work unique?"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string) => {
    setIsTyping(true)
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const responses = {
      "design": "Based on Vraj's portfolio, he's a versatile designer who excels in product design, UI/UX, and design systems. He's worked on projects at Luma helping millions of users, freelanced with startups like Linktree and Whop, and has a strong focus on user-centered design. His work spans from mobile apps to web platforms, with particular expertise in creating intuitive interfaces and scalable design systems.",
      "luma": "Vraj has been at Luma for 4 years as a Product Designer, working on core booking flows used by 2M+ monthly users. He redesigned the host dashboard improving conversion by 15%, and established a design system used across 50+ features. His work focuses on both guest and host experiences, helping millions of users navigate the platform effectively.",
      "process": "Vraj's design process is deeply user-centered. He starts with research and competitive analysis, conducts user interviews, builds scalable design systems with reusable components, and focuses on progressive disclosure to keep interfaces clean. He balances data-driven decisions with creative solutions, always considering accessibility and responsive design.",
      "projects": "Vraj's recent work includes Orimi (invoicing for freelancers), Profound Conversation Explorer (AI keyword research tool), and various freelance projects. His projects show a pattern of solving real problems - from payment frustrations to AI-powered research tools. Each project demonstrates his ability to take complex problems and create elegant, user-friendly solutions.",
      "unique": "What makes Vraj's work unique is his neurodivergent perspective - he loves blending styles and clashing genres. He balances the artist's urge with the designer's duty, creating for the soul while designing for the world. His background as a dancer and DJ influences his design thinking, bringing rhythm and flow to user experiences."
    }

    let response = "I'm not sure about that specific question. Could you try asking about his design work, experience at Luma, his design process, recent projects, or what makes his work unique?"
    
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes('design') || lowerMessage.includes('what can') || lowerMessage.includes('do')) {
      response = responses.design
    } else if (lowerMessage.includes('luma') || lowerMessage.includes('experience')) {
      response = responses.luma
    } else if (lowerMessage.includes('process') || lowerMessage.includes('how')) {
      response = responses.process
    } else if (lowerMessage.includes('project') || lowerMessage.includes('recent')) {
      response = responses.projects
    } else if (lowerMessage.includes('unique') || lowerMessage.includes('different')) {
      response = responses.unique
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    }])
    setIsTyping(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }])
    setInputValue('')
    
    await generateResponse(userMessage)
  }

  const handleQuickAction = async (action: string) => {
    setInputValue(action)
    await handleSendMessage()
  }

  return (
    <section className="py-32 flex items-start justify-center">
      <div className="text-left w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-heading-24 font-semibold text-white/90 mb-4">AI Assistant</h2>
            <p className="text-white/60 text-[16px] leading-relaxed font-normal mb-8">
              Meet my AI assistant. Ask me anything about my work, experience, or what I can help you with!
            </p>
          </div>

          {/* AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
          >
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500/20 text-white border border-blue-500/30'
                        : 'bg-white/10 text-white/90 border border-white/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 text-white/90 border border-white/20 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="mb-4">
              <p className="text-white/60 text-xs mb-3">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-white/70 hover:text-white text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about Vraj's work..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 rounded-xl text-white text-sm transition-all duration-200"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIAssistant 