export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface ChatMessageProps {
    message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className={`message ${message.role === "user" ? "message-user" : "message-assistant"}`}>
            {message.content}
        </div>
    )
}
