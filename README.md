# Real-Time Crypto & Market Pulse Dashboard

A premium, high-performance cryptocurrency dashboard built with React 19, Vite, and Tailwind CSS 4. This application provides real-time market data, interactive charts, and a personalized watchlist for crypto enthusiasts.

## ✨ Features

- **Real-Time Market Data**: Live tracking of top cryptocurrencies with price changes, market cap, and volume.
- **Interactive Charts**:
  - **Sparklines**: Quick visual representation of 7-day price trends in the list view.
  - **Detailed Area Charts**: Comprehensive 24h price trend visualization for individual coins.
- **Advanced Search**: Instantly find any cryptocurrency by name or symbol.
- **Personalized Watchlist**: Add your favorite coins to a persistent watchlist for quick access.
- **Detailed Insights**: Detailed coin information including market rank, supply, and 24h highs/lows in a premium modal view.
- **Modern UI/UX**:
  - Fully responsive design for all screen sizes.
  - Dynamic Dark/Light mode support.
  - Glassmorphic elements and smooth micro-animations.
  - Premium typography with Inter and Outfit.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Transitions**: [Framer Motion](https://www.framer.com/motion/) / [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Core dashboard features (CryptoList, Watchlist, etc.)
│   └── ui/              # Radix UI and base components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and shared logic
├── styles/              # Global CSS and Tailwind configurations
├── App.tsx              # Main application entry point
└── main.tsx             # Rendering logic
```

## 📄 License

This project is licensed under the MIT License.
