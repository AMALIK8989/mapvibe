import { useState } from 'react'
import './App.css'
import SitemapGenerator from './components/SitemapGenerator'
import SitemapHistory from './components/SitemapHistory'
import ThreeBackground from './components/ThreeBackground'

function App() {
  const [sitemaps, setSitemaps] = useState([])

  const addSitemap = (sitemap) => {
    setSitemaps(prev => [sitemap, ...prev])
  }

  return (
    <div className="app">
      <ThreeBackground />
      <div className="main-content">
        <header>
          <h1>MapVibe</h1>
          <h2>Professional XML Sitemap Generator</h2>
          <p>Generate professional XML sitemaps instantly with multi-device crawling, 3D interface, and real-time analytics. Boost your website's SEO ranking on Google, Bing, and Yandex.</p>
          <div className="features-highlight">
            <span className="feature-tag">✨ Multi-Device Crawling</span>
            <span className="feature-tag">🎯 SEO Optimized</span>
            <span className="feature-tag">⚡ Real-time Analytics</span>
            <span className="feature-tag">💾 Cloud Storage</span>
          </div>
        </header>
        
        <main>
          <SitemapGenerator onSitemapGenerated={addSitemap} />
          <SitemapHistory sitemaps={sitemaps} />
        </main>
      </div>
    </div>
  )
}

export default App
