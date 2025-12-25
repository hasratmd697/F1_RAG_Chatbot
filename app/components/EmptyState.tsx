interface EmptyStateProps {
    title?: string
    description?: string
}

export default function EmptyState({ 
    title = "Welcome to F1GPT", 
    description = "Ask me anything about Formula 1 — drivers, teams, races, history, and more!" 
}: EmptyStateProps) {
    return (
        <div className="empty-state">
            <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    )
}
