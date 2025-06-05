const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const userAgents = require('user-agents');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// User agents for different devices
const deviceUserAgents = {
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
  android: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  macbook: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Utility function to delay requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Website crawler function
const crawlWebsite = async (url, userAgent, maxDepth = 2, currentDepth = 0, visited = new Set()) => {
  if (currentDepth > maxDepth || visited.has(url)) {
    return [];
  }

  visited.add(url);
  const urls = [];

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const baseUrl = new URL(url).origin;
    
    // Extract all links
    $('a[href]').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          let fullUrl;
          if (href.startsWith('http')) {
            fullUrl = href;
          } else if (href.startsWith('/')) {
            fullUrl = baseUrl + href;
          } else {
            fullUrl = new URL(href, url).href;
          }
          
          // Only include URLs from the same domain
          if (new URL(fullUrl).origin === baseUrl) {
            urls.push({
              url: fullUrl,
              lastmod: new Date().toISOString(),
              changefreq: 'weekly',
              priority: currentDepth === 0 ? 1.0 : 0.8 - (currentDepth * 0.2)
            });
          }
        } catch (e) {
          // Skip invalid URLs
        }
      }
    });

    // Add current URL
    urls.push({
      url: url,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: currentDepth === 0 ? 1.0 : 0.8 - (currentDepth * 0.2)
    });

    // Recursively crawl found URLs (with delay to be respectful)
    if (currentDepth < maxDepth) {
      for (const urlObj of urls.slice(0, 10)) { // Limit to prevent infinite crawling
        await delay(1000); // 1 second delay between requests
        const childUrls = await crawlWebsite(urlObj.url, userAgent, maxDepth, currentDepth + 1, visited);
        urls.push(...childUrls);
      }
    }

    return urls;
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
    return [];
  }
};

// API Routes

// Generate sitemap for a website
app.post('/api/generate-sitemap', async (req, res) => {
  try {
    const { url, deviceType, maxDepth = 2 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const userAgent = deviceUserAgents[deviceType] || deviceUserAgents.desktop;
    
    // Crawl website
    console.log(`Starting crawl for ${url} with ${deviceType} user agent`);
    const urls = await crawlWebsite(url, userAgent, maxDepth);
    
    // Remove duplicates
    const uniqueUrls = urls.filter((url, index, self) => 
      index === self.findIndex(u => u.url === url.url)
    );

    // Generate sitemap XML
    const sitemapStream = new SitemapStream({ hostname: new URL(url).origin });
    const xmlData = await streamToPromise(Readable.from(uniqueUrls).pipe(sitemapStream));
    
    // Store in Supabase
    const { data, error } = await supabase
      .from('sitemaps')
      .insert({
        website_url: url,
        device_type: deviceType,
        sitemap_xml: xmlData.toString(),
        urls_count: uniqueUrls.length,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error:', error);
    }

    res.json({
      success: true,
      sitemap: xmlData.toString(),
      urlsCount: uniqueUrls.length,
      deviceType: deviceType
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Get sitemap history
app.get('/api/sitemaps', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sitemaps')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching sitemaps:', error);
    res.status(500).json({ error: 'Failed to fetch sitemaps' });
  }
});

// Download sitemap by ID
app.get('/api/sitemap/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('sitemaps')
      .select('sitemap_xml, website_url')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Sitemap not found' });
    }

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="sitemap-${new URL(data.website_url).hostname}.xml"`);
    res.send(data.sitemap_xml);

  } catch (error) {
    console.error('Error downloading sitemap:', error);
    res.status(500).json({ error: 'Failed to download sitemap' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

