# 🦋 FinFly Wings - Modern Finance Dashboard

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-green?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn--ui-0.9-gray?style=for-the-badge&logo=shadcn)](https://ui.shadcn.com)

## Overview

FinFly Wings is a modern, responsive finance management dashboard built with React 18, TypeScript, and the latest UI libraries. It provides users (viewers/admins) with comprehensive tools to track transactions, monitor portfolio performance, execute trades, view insights, and receive AI-powered suggestions via a floating chatbot.

**Approach:**
- **State Management:** AppContext with mock data generation (transactions, portfolio, market data, notifications) and localStorage persistence.
- **Data Fetching:** Tanstack Query (React Query) for caching.
- **Routing:** React Router for SPA navigation.
- **UI:** shadcn/ui components (fully accessible, customizable), Tailwind CSS, dark mode support, responsive design with mobile sidebar.
- **Charts:** Recharts for balance trends, spending breakdowns.
- **Demo Data:** Realistic mock data for Indian markets (Reliance, TCS, BTC, NiftyBees, bonds) and categories (Food, Salary, Investment, etc.).

## Features 🚀

- **Dashboard**: Summary cards (balance/income/expenses/savings), spending breakdown pie chart, balance trend line chart, recent transactions list, AI insights section.
- **Transaction Management**: Filter/search/sort by type/category/amount/date, add/edit/delete transactions with categories (Food, Transport, Salary, Investment, etc.).
- **Portfolio**: Track holdings (stocks, crypto, ETFs, bonds) with current prices, P&L.
- **Trade Page**: Live market data feed (stocks/crypto/ETFs/bonds), search/trade interface.
- **Investments**: Dedicated insights and opportunities.
- **Notifications**: Real-time alerts/suggestions (unread count), mark as read.
- **Profile**: User stats, mock multi-user support for admins.
- **Admin Panel**: Manage users, send investment suggestions.
- **AI Chatbot**: Floating assistant for queries (powered by context).
- **Sidebar Navigation**: Collapsible, role-based links (Dashboard, Trade, Portfolio, etc.), mobile drawer.
- **Dark/Light Mode**: Toggle with persistence.
- **Responsive**: Mobile-first design with hooks.
- **Accessibility**: ARIA-compliant shadcn/ui components.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | React 18, TypeScript 5.8 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4, clsx, cva, Tailwind Merge |
| UI Components | shadcn/ui (Radix UI primitives), Lucide React icons |
| Charts | Recharts 2.15 |
| Data | Tanstack Query 5, Zod validation, React Hook Form |
| Router | React Router 6.30 |
| Utils | date-fns, Sonner toasts, Vaul drawer |
| Testing | Vitest, Playwright, Testing Library |
| Dev Tools | ESLint 9, PostCSS, SWC |

## Quick Start 🛫

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh) (recommended)
- Git

### Setup
```bash
# Clone the repo
git clone <your-repo-url> my-finance-wings-main
cd my-finance-wings-main

# Install dependencies (Bun recommended)
bun install
 or npm install

# Run development server
bun dev
 or npm run dev

# Open http://localhost:8080
```

### Available Scripts
- `bun dev` - Start dev server (http://localhost:8080)
- `bun build` - Build for production (`dist/`)
- `bun lint` - Lint code
- `bun test` - Run tests
- `bun preview` - Preview production build

## Project Structure
```
my-finance-wings-main/
├── src/
│   ├── components/     # UI components (shadcn/ui, charts, sidebar, etc.)
│   ├── context/        # AppContext (state, mock data)
│   ├── pages/          # Routed pages (Dashboard, Portfolio, Trade)
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utils (currency formatter)
├── public/             # Static assets
├── tests/              # Vitest/Playwright
└── configs/            # Vite, Tailwind, ESLint, TS
```

## Screenshots
*(Add screenshots of dashboard, charts, mobile view)*

## Pages & Routes
- `/` → Dashboard (main overview)
- `/trade` → Trade interface with market data
- `/portfolio` → Portfolio holdings P&L
- `/investments` → Investment opportunities
- `/profile` → User profile & stats
- `/notifications` → Notification center
- `/admin-users` → Admin user management

## Contributing
1. Fork & clone
2. `bun install`
3. `bun dev`
4. Add features/tests
5. PR to `main`

## License
MIT

---