import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop, faMobile, faTablet, faLaptop, faDownload, faGlobe, faSpinner } from '@fortawesome/free-solid-svg-icons'

const devices = [
  {
    id: 'desktop',
    name: 'Desktop PC',
    icon: faDesktop,
    description: 'Windows/Linux Desktop'
  },
  {
    id: 'mobile',
    name: 'iPhone',
    icon: faMobile,
    description: 'iOS Mobile Safari'
  },
  {
    id: 'android',
    name: 'Android',
    icon: faMobile,
    description: 'Android Chrome'
  },
  {
    id: 'macbook',
    name: 'MacBook',
    icon: faLaptop,
    description: 'macOS Safari/Chrome'
  }
]

const SitemapGenerator = () => {
  const [url, setUrl] = useState('')
  const [selectedDevice, setSelectedDevice] = useState('desktop')
  const [maxDepth, setMaxDepth] = useState(2)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (include http:// or https://)')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await axios.post('/api/generate-sitemap', {
        url: url.trim(),
        deviceType: selectedDevice,
        maxDepth: parseInt(maxDepth)
      })

      setResults(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate sitemap')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!results?.sitemap) return
    
    const blob = new Blob([results.sitemap], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    const hostname = new URL(document.querySelector('input').value).hostname
    a.href = url
    a.download = `sitemap-${hostname}-${selectedDevice}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="generator-container">
      <h2 className="text-center mb-4" style={{ color: '#4ecdc4', fontSize: '2rem' }}>
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        Generate Sitemap
      </h2>

      <div className="form-group">
        <label className="form-label">Website URL</label>
        <input
          type="url"
          className="form-input"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Max Crawl Depth</label>
        <select
          className="form-select"
          value={maxDepth}
          onChange={(e) => setMaxDepth(e.target.value)}
          disabled={loading}
        >
          <option value={1}>1 level (homepage only)</option>
          <option value={2}>2 levels (recommended)</option>
          <option value={3}>3 levels (thorough)</option>
          <option value={4}>4 levels (extensive)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Device Type / User Agent</label>
        <div className="device-grid">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`device-card ${selectedDevice === device.id ? 'selected' : ''}`}
              onClick={() => !loading && setSelectedDevice(device.id)}
            >
              <FontAwesomeIcon icon={device.icon} className="device-icon" />
              <div className="device-name">{device.name}</div>
              <div className="device-description">{device.description}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(255, 107, 107, 0.2)', 
          border: '1px solid rgba(255, 107, 107, 0.5)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}

      <button
        className="generate-button"
        onClick={handleGenerate}
        disabled={loading || !url.trim()}
      >
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Generating Sitemap...
          </div>
        ) : (
          <>Generate Sitemap</>
        )}
      </button>

      {results && (
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">Sitemap Generated Successfully!</h3>
            <button className="download-button" onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download XML
            </button>
          </div>

          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-value">{results.urlsCount}</span>
              <span className="stat-label">URLs Found</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{results.deviceType}</span>
              <span className="stat-label">Device Type</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(results.sitemap.length / 1024)}KB</span>
              <span className="stat-label">File Size</span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '1rem',
            maxHeight: '300px',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
            <pre style={{ 
              color: '#e0e0e0', 
              fontSize: '0.8rem', 
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {results.sitemap.substring(0, 1000)}...
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default SitemapGenerator

