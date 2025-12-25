interface HeaderProps {
    title?: string
}

export default function Header({ title = "F1GPT" }: HeaderProps) {
    return (
        <header className="header">
            <div className="logo">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
                </svg>
            </div>
            <h1>{title}</h1>
        </header>
    )
}
