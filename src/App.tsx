import { useState } from 'react'
import FileConverter from './components/FileConverter'
import Header from './components/Header'
import ConversionHistory from './components/ConversionHistory'

export interface Conversion {
  id: string
  filename: string
  originalFormat: string
  targetFormat: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  downloadUrl?: string
  error?: string
  timestamp: Date
}

function App() {
  const [conversions, setConversions] = useState<Conversion[]>([])

  const addConversion = (conversion: Conversion) => {
    setConversions(prev => [conversion, ...prev])
  }

  const updateConversion = (id: string, updates: Partial<Conversion>) => {
    setConversions(prev =>
      prev.map(conv => (conv.id === id ? { ...conv, ...updates } : conv))
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <FileConverter 
          onConversionStart={addConversion}
          onConversionUpdate={updateConversion}
        />
        <ConversionHistory conversions={conversions} />
      </main>
    </div>
  )
}

export default App
