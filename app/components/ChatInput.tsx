"use client"

import { FormEvent } from "react"

interface ChatInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: (e: FormEvent) => void
    isLoading: boolean
    placeholder?: string
}

export default function ChatInput({ 
    value, 
    onChange, 
    onSubmit, 
    isLoading, 
    placeholder = "Ask about F1..." 
}: ChatInputProps) {
    return (
        <form className="input-area" onSubmit={onSubmit}>
            <input
                type="text"
                className="input-field"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
            />
            <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading || !value.trim()}
                aria-label="Send message"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </form>
    )
}
