import { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faCalendar, faGlobe, faDesktop, faMobile, faLaptop, faSpinner } from '@fortawesome/free-solid-svg-icons'

const deviceIcons = {
  desktop: faDesktop,
  mobile: faMobile,
  android: faMobile,
  macbook: faLaptop
}

const SitemapHistory = () => {
  const [sitemaps, setSitemaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSitemaps()
  }, [])

  const fetchSitemaps = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/sitemaps')
      setSitemaps(response.data || [])
    } catch (err) {
      setError('Failed to fetch sitemap history')
      console.error('Error fetching sitemaps:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (sitemapId, websiteUrl) => {
    try {
      const response = await axios.get(`/api/sitemap/${sitemapId}/download`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/xml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      const hostname = new URL(websiteUrl).hostname
      a.href = url
      a.download = `sitemap-${hostname}.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading sitemap:', err)
      alert('Failed to download sitemap')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="history-container text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mb-3" style={{ color: '#4ecdc4' }} />
        <p>Loading sitemap history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="history-container">
        <div style={{ 
          background: 'rgba(255, 107, 107, 0.2)', 
          border: '1px solid rgba(255, 107, 107, 0.5)',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          color: '#ff6b6b'
        }}>
          <h3>Error Loading History</h3>
          <p>{error}</p>
          <button 
            onClick={fetchSitemaps}
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid #ff6b6b',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: '#ff6b6b',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="history-container">
      <h2 className="text-center mb-4" style={{ color: '#4ecdc4', fontSize: '2rem' }}>
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        Sitemap History
      </h2>

      {sitemaps.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <FontAwesomeIcon icon={faGlobe} size="3x" style={{ color: '#4ecdc4', opacity: 0.5 }} className="mb-3" />
          <h3 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>No Sitemaps Generated Yet</h3>
          <p style={{ opacity: 0.7 }}>Generate your first sitemap to see it here!</p>
        </div>
      ) : (
        <div>
          <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.8 }}>
            Found {sitemaps.length} generated sitemap{sitemaps.length !== 1 ? 's' : ''}
          </p>
          
          {sitemaps.map((sitemap) => (
            <div key={sitemap.id} className="history-item">
              <div className="history-header">
                <h3 className="history-url">{sitemap.website_url}</h3>
                <span className="history-date">
                  <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                  {formatDate(sitemap.created_at)}
                </span>
              </div>
              
              <div className="history-details">
                <div className="history-stat">
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>{sitemap.urls_count} URLs</span>
                </div>
                
                <div className="device-badge">
                  <FontAwesomeIcon icon={deviceIcons[sitemap.device_type] || faDesktop} className="mr-1" />
                  {sitemap.device_type}
                </div>
                
                <button
                  className="download-button"
                  onClick={() => handleDownload(sitemap.id, sitemap.website_url)}
                  style={{ marginLeft: 'auto' }}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SitemapHistory

