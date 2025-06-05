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
          <h1>Sitemap Generator</h1>
          <p>Generate XML sitemaps for your websites</p>
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
