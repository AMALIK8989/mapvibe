# MapVibe - Professional XML Sitemap Generator

🚀 **Generate professional XML sitemaps instantly** with multi-device crawling, 3D interface, and real-time analytics. Boost your website's SEO ranking on Google, Bing, and Yandex.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/mapvibe/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-green.svg)](https://mapvibe.netlify.app/)

🌐 **Live Demo:** [https://mapvibe.netlify.app/](https://mapvibe.netlify.app/)

---

## 🎯 Why MapVibe?

MapVibe is not just another sitemap generator. It's a **professional SEO tool** designed for modern websites with:

- **AI-Optimized SEO**: Built for Google, Bing, Yandex, and AI search engines
- **Multi-Device Crawling**: Desktop, iPhone, Android, MacBook user agents
- **Beautiful 3D Interface**: Modern glassmorphism design with Three.js
- **Real-time Analytics**: Track crawl progress and sitemap statistics
- **Cloud Storage**: Store and manage sitemaps with Supabase
- **Professional Output**: XML sitemaps that follow search engine guidelines

## Features

- 🌐 **Multi-Device Crawling**: Generate sitemaps using different user agents (Desktop PC, iPhone, Android, MacBook)
- 🎨 **Beautiful 3D Interface**: Interactive Three.js background with modern glassmorphism design
- 📊 **Real-time Analytics**: Track crawl progress and sitemap statistics
- 💾 **Cloud Storage**: Store sitemaps in Supabase with full history
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast & Efficient**: Optimized crawling with respectful delays
- 🔒 **Secure**: Built with security best practices

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Lightning-fast development
- **Three.js & React Three Fiber** - 3D graphics and animations
- **Font Awesome** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Express.js** - Web server framework
- **Cheerio** - Server-side HTML parsing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

### Database & Hosting
- **Supabase** - PostgreSQL database and authentication
- **Netlify** - Frontend hosting (ready for deployment)

## Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sitemap-generator
```

### 2. Install Dependencies
```bash
# Install main dependencies
npm install

# Install server dependencies
npm run server:install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `database/schema.sql`

### 4. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 5. Start Development

```bash
# Start both frontend and backend concurrently
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:5000

## Usage

1. **Enter a Website URL**: Input any website URL (include http:// or https://)
2. **Select Device Type**: Choose from Desktop PC, iPhone, Android, or MacBook
3. **Set Crawl Depth**: Choose how deep to crawl (1-4 levels)
4. **Generate Sitemap**: Click generate and wait for the crawling to complete
5. **Download XML**: Download the generated sitemap.xml file
6. **View History**: Check the history tab to see all generated sitemaps

## Device User Agents

- **Desktop PC**: Windows Chrome browser
- **iPhone**: iOS Safari mobile browser
- **Android**: Android Chrome mobile browser
- **MacBook**: macOS Safari/Chrome browser

## API Endpoints

- `POST /api/generate-sitemap` - Generate a new sitemap
- `GET /api/sitemaps` - Get sitemap history
- `GET /api/sitemap/:id/download` - Download specific sitemap
- `GET /api/health` - Health check

## Deployment

### Frontend (Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify
3. Update environment variables in Netlify dashboard

### Backend (Railway/Heroku/Vercel)

1. Deploy the `server` folder
2. Set environment variables
3. Update CORS_ORIGIN to your frontend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for the web development community**

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
