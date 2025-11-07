export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
            <path
              d="M16 8v16M12 12l4-4 4 4M12 20l4 4 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <h1>Professional File Converter</h1>
        </div>
        <p className="tagline">Convert audio, video, images, and documents with ease</p>
      </div>
      <style>{`
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-bottom: 1px solid var(--border);
          padding: 2rem 1.5rem;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .logo h1 {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .tagline {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-left: 3rem;
        }
      `}</style>
    </header>
  )
}
