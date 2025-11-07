import { useState, useRef } from 'react'
import axios from 'axios'
import type { Conversion } from '../App'

interface FileConverterProps {
  onConversionStart: (conversion: Conversion) => void
  onConversionUpdate: (id: string, updates: Partial<Conversion>) => void
}

const formatCategories = {
  audio: { icon: '🎵', formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'], label: 'Audio' },
  video: { icon: '🎥', formats: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'], label: 'Video' },
  image: { icon: '🖼️', formats: ['jpg', 'png', 'webp', 'gif', 'bmp'], label: 'Image' },
  document: { icon: '📄', formats: ['pdf', 'docx', 'txt', 'rtf', 'odt'], label: 'Document' },
}

type Category = keyof typeof formatCategories

export default function FileConverter({ onConversionStart, onConversionUpdate }: FileConverterProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState<Category>('audio')
  const [targetFormat, setTargetFormat] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) return

    const conversionId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const originalFormat = selectedFile.name.split('.').pop() || ''

    onConversionStart({
      id: conversionId,
      filename: selectedFile.name,
      originalFormat,
      targetFormat,
      status: 'pending',
      progress: 0,
      timestamp: new Date(),
    })

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('targetFormat', targetFormat)
    formData.append('category', category)

    try {
      onConversionUpdate(conversionId, { status: 'processing', progress: 10 })

      const response = await axios.post('/api/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const uploadProgress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          // Upload is first 30% of progress, conversion happens server-side
          onConversionUpdate(conversionId, { progress: Math.min(uploadProgress * 0.3, 30) })
        },
      })
      
      // After upload completes, show processing state (conversion happening server-side)
      onConversionUpdate(conversionId, { status: 'processing', progress: 70 })

      onConversionUpdate(conversionId, {
        status: 'completed',
        progress: 100,
        downloadUrl: response.data.downloadUrl,
      })

      setSelectedFile(null)
      setTargetFormat('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      onConversionUpdate(conversionId, {
        status: 'failed',
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || 'Conversion failed'
          : 'An unexpected error occurred',
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="file-converter">
      <div className="converter-card">
        <div className="category-tabs">
          {(Object.entries(formatCategories) as [Category, typeof formatCategories[Category]][]).map(([key, { icon, label }]) => (
            <button
              key={key}
              className={`category-tab ${category === key ? 'active' : ''}`}
              onClick={() => {
                setCategory(key)
                setTargetFormat('')
              }}
            >
              <span className="tab-icon">{icon}</span>
              <span className="tab-label">{label}</span>
            </button>
          ))}
        </div>

        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept={category === 'image' ? 'image/*' : category === 'audio' ? 'audio/*' : category === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt,.rtf,.odt'}
          />
          {selectedFile ? (
            <div className="file-info">
              <div className="file-icon">📎</div>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <h3>Drop your file here</h3>
              <p>or click to browse</p>
            </div>
          )}
        </div>

        <div className="format-selector">
          <label htmlFor="format-select">Convert to:</label>
          <select
            id="format-select"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="">Select format</option>
            {formatCategories[category].formats.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          className="convert-button"
          onClick={handleConvert}
          disabled={!selectedFile || !targetFormat}
        >
          Convert File
        </button>
      </div>

      <style>{`
        .file-converter {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1.5rem;
        }
        
        .converter-card {
          background: var(--surface);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
        .category-tabs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .category-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .category-tab:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
        }
        
        .category-tab.active {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border-color: transparent;
          color: white;
        }
        
        .tab-icon {
          font-size: 1.5rem;
        }
        
        .upload-area {
          border: 3px dashed var(--border);
          border-radius: 1rem;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 1.5rem;
          background: var(--background);
        }
        
        .upload-area:hover {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }
        
        .upload-area.dragging {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }
        
        .upload-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .upload-icon {
          font-size: 3rem;
          opacity: 0.5;
        }
        
        .upload-prompt h3 {
          font-size: 1.25rem;
          color: var(--text);
          margin: 0;
        }
        
        .upload-prompt p {
          color: var(--text-secondary);
          margin: 0;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 0.5rem;
        }
        
        .file-icon {
          font-size: 2rem;
        }
        
        .file-details {
          flex: 1;
          text-align: left;
        }
        
        .file-name {
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }
        
        .file-size {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
        }
        
        .format-selector {
          margin-bottom: 1.5rem;
        }
        
        .format-selector label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text);
        }
        
        .format-selector select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 0.5rem;
          color: var(--text);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .format-selector select:hover:not(:disabled) {
          border-color: var(--primary);
        }
        
        .format-selector select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .convert-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .convert-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        
        .convert-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .main-content {
          min-height: calc(100vh - 200px);
          padding-bottom: 2rem;
        }
        
        .app {
          min-height: 100vh;
          background: var(--background);
        }
      `}</style>
    </div>
  )
}
