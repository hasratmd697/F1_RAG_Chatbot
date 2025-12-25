"use client"

import { useRef, useEffect, ReactNode } from "react"

interface ChatContainerProps {
    children: ReactNode
}

export default function ChatContainer({ children }: ChatContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when children change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    })

    return (
        <div className="chat-container" ref={containerRef}>
            {children}
        </div>
    )
}
