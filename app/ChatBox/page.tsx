'use client'

import { useState } from 'react'

export default function ChatBox() {
  const [userMessage, setUserMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!userMessage.trim()) return
    setLoading(true)

    setChatHistory((prev) => [...prev, { sender: 'user', text: userMessage }])

    try {
      const response = await fetch('https://back-3-yciv.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: userMessage,
          history: chatHistory.map((msg) => ({
            role: msg.sender,
            content: msg.text,
          })),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setChatHistory((prev) => [...prev, { sender: 'bot', text: data.bot_response }])
      } else {
        setChatHistory((prev) => [...prev, { sender: 'bot', text: `Error: ${data.detail}` }])
      }
    } catch {
      setChatHistory((prev) => [...prev, { sender: 'bot', text: 'Server not reachable.' }])
    }

    setUserMessage('')
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[#FFF7F0] p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl border">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#6F4E37]">
          🤖 MusicMate AI Assistant
        </h1>

        <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-[#6F4E37] text-white ml-auto w-fit'
                  : 'bg-gray-200 text-black w-fit'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-gray-400 italic">Thinking...</p>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#6F4E37] text-white px-4 py-2 rounded-xl hover:bg-[#5c3e2e] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
