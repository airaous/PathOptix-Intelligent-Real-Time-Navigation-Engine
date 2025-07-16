# 🧠 PathOptix - Intelligent Real-Time Navigation Engine

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://pathoptix.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Google Maps](https://img.shields.io/badge/Google_Maps-Platform-red)](https://developers.google.com/maps)

> **Real-time AI-powered navigation and route optimization engine built with React and Google Maps Platform.**

PathOptix is a sophisticated web application that provides intelligent navigation solutions with real-time traffic analysis, multi-modal route planning, and smart optimization algorithms. Designed as a proof-of-concept for delivery and ride-hailing optimization systems.

![PathOptix Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=PathOptix+Screenshot)

## ✨ Features

### 🗺️ **Smart Navigation**
- **Interactive Google Maps** with real-time traffic overlays
- **Multiple Travel Modes**: Car, Walking, Bicycling, Transit
- **Alternative Route Suggestions** with intelligent comparison
- **Click-to-set** origin and destination markers

### 🚀 **Real-Time Optimization**
- **Live Traffic Analysis** using Google Traffic Layer
- **Dynamic Route Recalculation** based on current conditions
- **ETA Predictions** with traffic-aware duration estimates
- **Smart Rerouting** recommendations

### 💡 **Intelligent Features**
- **Places Autocomplete** with smart search suggestions
- **Step-by-step Navigation** with turn-by-turn directions
- **Route Comparison** interface for multiple path options
- **Mobile-Responsive Design** with touch-friendly controls

### 🎨 **Modern UI/UX**
- **Framer Motion** animations for smooth interactions
- **Tailwind CSS** for beautiful, responsive design
- **Glass morphism** effects and modern visual elements
- **Dark/Light theme** support (planned)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** with modern hooks and context
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for advanced animations

### Google Maps Platform
- **Google Maps JavaScript API** - Core mapping functionality
- **Google Places API** - Location search and autocomplete
- **Google Directions API** - Route calculation and optimization
- **Google Traffic Layer** - Real-time congestion data

### Additional Libraries
- **@react-google-maps/api** - React wrapper for Google Maps
- **use-places-autocomplete** - Enhanced autocomplete functionality
- **Lucide React** - Beautiful icon library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Maps Platform API key with the following APIs enabled:
  - Maps JavaScript API
  - Places API  
  - Directions API
  - Geocoding API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/airaous/PathOptix-Intelligent-Real-Time-Navigation-Engine.git
   cd PathOptix-Intelligent-Real-Time-Navigation-Engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Maps API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see PathOptix in action! 🎉

## 🗝️ Google Maps API Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for the project

### Step 2: Enable Required APIs
Enable these APIs in the Google Cloud Console:
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API (optional)

### Step 3: Create API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key
4. (Recommended) Restrict the API key to your domains

### Step 4: Configure API Key
Add your API key to `.env.local`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

> **⚠️ Important**: Keep your API key secure and never commit it to version control.

## 📱 Usage Guide

### Basic Navigation
1. **Set Origin**: Use the search box or click "From" → select on map
2. **Set Destination**: Use the search box or click "To" → select on map  
3. **Choose Travel Mode**: Select Car, Walk, Bike, or Transit
4. **View Route**: See real-time route with traffic conditions
5. **Explore Alternatives**: Compare different route options

### Advanced Features
- **Traffic Toggle**: Turn traffic layer on/off for better visibility
- **Route Details**: Expand to see step-by-step directions
- **Alternative Routes**: Compare multiple path options
- **Mobile Support**: Full touch interface on mobile devices

## 🏗️ Project Structure

```
PathOptix/
├── public/
│   ├── pathoptix-icon.svg      # App icon
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── MapView.jsx         # Main map component
│   │   ├── AutocompleteInput.jsx # Search input with autocomplete
│   │   ├── ModeSelector.jsx    # Travel mode selection
│   │   ├── RoutePanel.jsx      # Route details sidebar
│   │   ├── Header.jsx          # App header
│   │   ├── LoadingScreen.jsx   # Loading animation
│   │   └── ErrorBoundary.jsx   # Error handling
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles and Tailwind
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
└── README.md                 # This file
```

## 🎨 Customization

### Styling
PathOptix uses Tailwind CSS for styling. Customize the design by:
- Modifying `tailwind.config.js` for theme customization
- Editing component styles in individual `.jsx` files
- Adding custom CSS in `src/index.css`

### Map Configuration
Customize map behavior in `MapView.jsx`:
```javascript
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  // Add your custom options
};
```

### Travel Modes
Add or modify travel modes in `ModeSelector.jsx`:
```javascript
const MODES = [
  {
    id: 'DRIVING',
    name: 'Car',
    icon: Car,
    color: 'blue'
  },
  // Add custom modes
];
```

## 🚀 Deployment

> **⚠️ Security First:** Before deploying, complete the security checklist in `SECURITY-CHECKLIST.md`

PathOptix uses a **two-component architecture**:

### 🎨 Frontend (React App)
**Deploys to:** Static hosting (Vercel, Netlify, etc.)
**Contains:** User interface, Google Maps integration, UI components

### 🧠 Backend (FastAPI)
**Deploys to:** Server hosting (Zeabur, Railway, Heroku, etc.)
**Contains:** AI/ML predictions, route optimization, API endpoints

### Quick Deploy (Recommended Setup)

#### Current Configuration:
- **Frontend:** Vercel → `https://your-app.vercel.app`
- **Backend:** Zeabur → `https://deeproute-ai-api.zeabur.app` ✅ (Already deployed!)

#### Deploy Frontend to Vercel:
1. **Clean sensitive data:**
   ```bash
   git rm deeproute_ai_development.ipynb  # Remove notebook with API key
   git commit -m "Security cleanup"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `VITE_GOOGLE_MAPS_API_KEY`
   - Deploy! 🚀

3. **Verify deployment:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://deeproute-ai-api.zeabur.app` (already running)

### Alternative Deployment Options

#### Frontend Platforms:
- **Vercel** (Recommended) - Zero config, automatic HTTPS, global CDN
- **Netlify** - Drag and drop `dist` folder after `npm run build`
- **GitHub Pages** - Use GitHub Actions for automatic deployment
- **Firebase Hosting** - Use Firebase CLI

#### Backend Platforms:
- **Zeabur** (Current) - Python serverless hosting
- **Railway** - Container hosting with auto-scaling  
- **Heroku** - Platform as a Service
- **DigitalOcean App Platform** - Managed platform
- **AWS Lambda** - Serverless functions

### Build for Production
```bash
npm run build
# Creates optimized production build in `dist` folder
```

📖 **Detailed Instructions:** See `DEPLOY-GUIDE.md` for step-by-step deployment guide

The optimized production build will be in the `dist` folder.

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
```

### Code Quality
- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (add .prettierrc if needed)
- **TypeScript**: Can be added for type safety

### Environment Variables
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_DEBUG=false                    # Enable debug mode
VITE_NODE_ENV=development          # Environment setting
```

## 🔮 Future Enhancements (Phase 2)

### Machine Learning Integration
- **Graph Neural Networks (GNN)** for advanced route prediction
- **Deep Q-Networks (DQN)** for dynamic routing decisions
- **Custom ML models** to override Google suggestions when beneficial

### Advanced Features
- **Real-time rerouting** based on live traffic updates
- **Predictive traffic analysis** using historical data
- **Multi-stop route optimization** for delivery scenarios
- **Voice navigation** integration
- **Offline map support** for areas with poor connectivity

### Business Applications
- **Delivery optimization** for logistics companies
- **Ride-hailing integration** for transportation services
- **Fleet management** tools for businesses
- **Analytics dashboard** for route performance metrics

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling consistency
- Add proper error handling and loading states
- Write clear commit messages
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** for powerful mapping APIs
- **React Community** for amazing libraries and tools
- **Tailwind CSS** for beautiful utility-first styling
- **Framer Motion** for smooth animations
- **Vercel** for seamless deployment experience

## 📞 Support

Having issues? Here are some resources:

- **Documentation**: Check this README and inline code comments
- **Google Maps API**: [Official documentation](https://developers.google.com/maps/documentation)
- **React**: [Official React docs](https://reactjs.org/docs)
- **Issues**: [Create an issue](https://github.com/airaous/PathOptix-Intelligent-Real-Time-Navigation-Engine/issues) on GitHub

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=airaous/PathOptix-Intelligent-Real-Time-Navigation-Engine&type=Date)](https://star-history.com/#airaous/PathOptix-Intelligent-Real-Time-Navigation-Engine&Date)

---

<div align="center">

**Built with ❤️ by the PathOptix Team**

[🌐 Website](https://pathoptix.vercel.app) • [📧 Email](mailto:contact@pathoptix.com) • [🐦 Twitter](https://twitter.com/pathoptix)

</div>
