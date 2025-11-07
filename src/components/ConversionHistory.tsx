import type { Conversion } from '../App'

interface ConversionHistoryProps {
  conversions: Conversion[]
}

export default function ConversionHistory({ conversions }: ConversionHistoryProps) {
  if (conversions.length === 0) return null

  const getStatusColor = (status: Conversion['status']) => {
    switch (status) {
      case 'completed':
        return 'var(--success)'
      case 'failed':
        return 'var(--danger)'
      case 'processing':
        return 'var(--warning)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getStatusIcon = (status: Conversion['status']) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'failed':
        return '✗'
      case 'processing':
        return '⟳'
      default:
        return '⋯'
    }
  }

  return (
    <div className="conversion-history">
      <h2>Conversion History</h2>
      <div className="history-list">
        {conversions.map((conv) => (
          <div key={conv.id} className="history-item">
            <div className="item-header">
              <div className="item-info">
                <span className="filename">{conv.filename}</span>
                <span className="conversion-path">
                  {conv.originalFormat.toUpperCase()} → {conv.targetFormat.toUpperCase()}
                </span>
              </div>
              <div className="status-badge" style={{ color: getStatusColor(conv.status) }}>
                <span className="status-icon">{getStatusIcon(conv.status)}</span>
                <span className="status-text">{conv.status}</span>
              </div>
            </div>

            {conv.status === 'processing' && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${conv.progress}%` }}></div>
              </div>
            )}

            {conv.status === 'completed' && conv.downloadUrl && (
              <a href={conv.downloadUrl} download className="download-button">
                Download File
              </a>
            )}

            {conv.status === 'failed' && conv.error && (
              <div className="error-message">{conv.error}</div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .conversion-history {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1.5rem;
        }
        
        .conversion-history h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--text);
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .history-item {
          background: var(--surface);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .filename {
          font-weight: 600;
          color: var(--text);
          font-size: 1rem;
        }
        
        .conversion-path {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .status-icon {
          font-size: 1rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: var(--background);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 0.75rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          transition: width 0.3s ease;
        }
        
        .download-button {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--success);
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .download-button:hover {
          background: #059669;
          transform: translateY(-2px);
        }
        
        .error-message {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid var(--danger);
          color: var(--danger);
          font-size: 0.875rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  )
}
