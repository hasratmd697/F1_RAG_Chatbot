"use client"

import { useState, FormEvent } from "react"
import { 
    ChatMessage, 
    ChatContainer, 
    LoadingDots, 
    type Message 
} from "./components"

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            })

            if (!response.ok) throw new Error("Failed to get response")

            const data = await response.json()
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, something went wrong. Please try again."
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const hasMessages = messages.length > 0

    return (
        <div className="app-container">
            {/* Minimal Header */}
            <header className="header">
                <div className="header-left">
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h1>F1GPT</h1>
                </div>
            </header>

            {hasMessages ? (
                <>
                    {/* Chat messages */}
                    <ChatContainer>
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        {isLoading && <LoadingDots />}
                    </ChatContainer>

                    {/* Input at bottom */}
                    <form className="input-area" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ask anything about F1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
                            </svg>
                        </button>
                    </form>
                </>
            ) : (
                /* Empty state - centered input */
                <div className="welcome-container">
                    <h2 className="welcome-title">Ready to talk F1? 🏎️</h2>
                    <form className="input-area centered" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Ask anything about F1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
