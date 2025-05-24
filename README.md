# YieldStark 🚀

![Starknet Hackathon](https://img.shields.io/badge/Starknet-Hackathon-5f4def)
![BTCfi](https://img.shields.io/badge/BTCfi-Season-orange)
![Pragma](https://img.shields.io/badge/Pragma-Integrated-blue)

> **Smart WBTC yield automation on Starknet. Deposit once, earn more through intelligent rebalancing across vesuxyz & EkuboProtocol**

YieldStark is a non-custodial yield optimizer that intelligently allocates Bitcoin (WBTC) into the most profitable DeFi opportunities across the Starknet ecosystem. Built with Next.js and Starknet, it provides a seamless experience for BTC holders to earn yield directly on their assets.

<div align="center">
  <img src="packages/nextjs/public/logo.jpg" alt="YieldStark Logo" width="200" height="200"/>
</div>

## 🎯 Problem Statement

Bitcoin holders looking to earn yield face several significant roadblocks:
-Lack of Native Yield Options
-Yield strategies are spread across multiple protocols, requiring manual research bridging, and tracking.
-Navigating yield farming, bridging, and gas optimization is too technical for the typical BTC holder.

## 💡 Solution

YieldStark solves the complexity of earning BTC-native yield through three core components:

1. **AI-Powered Yield Engine**
   -Real-time APY tracking across BTC strategies
   -Predictive modeling for optimal rebalancing
   -Risk-adjusted portfolio rotation

2. **Automated Smart Execution**
   -Non-custodial BTC deposits into top-performing pools
   -Rebalancing and compounding based on performance data
   -Auto-conversion of rewards into BTC

3. **Pragma Data Integration**
   -On-chain APY feeds for BTC strategies
   -Real-time pool metrics and risk signals
   -Decentralized and verifiable price + yield data

## 🤖 Agent Decision Logic

```ts
import { VesuOracleService } from "../services/vesuOracle";
import { EkuboOracleService } from "../services/ekuboOracle";

export async function decideBestProtocol() {
  const vesuAPY = await VesuOracleService.getInstance().calculateAPY();
  const ekuboAPR = await EkuboOracleService.getInstance().calculateAPR();

  return vesuAPY > ekuboAPR ? "vesu" : "ekubo";
}

// Usage:
// const best = await decideBestProtocol();
// // Use `best` to allocate funds accordingly
```

## 🏗️ YieldStark Agent Architecture

```plaintext
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ Pragma Price Feeds │───▶│  Analysis Engine   │───▶│  Strategy Engine   │
│ Vesu API           │    │  - APY Calculation │    │  - Allocation      │
│ Ekubo API          │    │  - Risk Metrics    │    │  - Rebalancing     │
│ Historical Data    │    │  - Market Trends   │    │  - Execution Plan  │
└────────────────────┘    └────────────────────┘    └────────────────────┘
         ▲                        │                        │
         │                        ▼                        ▼
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ User Portfolio     │    │   Risk Management  │    │ Performance &      │
│ - Deposits         │────▶   & Alerts         │────▶ Learning Module    │
│ - Withdrawals      │    │   - Thresholds     │    │ - Backtesting      │
│ - Balances         │    │   - Notifications  │    │ - Optimization     │
└────────────────────┘    └────────────────────┘    └────────────────────┘
```

> The YieldStark agent continuously collects data from integrated protocols and oracles, analyzes yield and risk, and executes optimal rebalancing strategies for user portfolios.

## Features

- **Bitcoin-Native Yield Optimization**: Focuses exclusively on Bitcoin, unlocking optimized yield opportunities without complex bridges or synthetic assets
- **AI-Driven Rebalancing**: Dynamically reallocates BTC deposits across top-performing protocols like Vesu and Ekubo
- **Built on Starknet**: Leverages Starknet's scalability and zero-knowledge infrastructure for fast, low-cost transactions
- **Real-time Price Tracking**: Integrated with Pragma for accurate BTC/USD price feeds
- **PWA Support**: Progressive Web App functionality for enhanced mobile experience

## 🏗 Codebase Architecture

```plaintext
YieldStark/
├── app/
│   ├── dashboard/                # User dashboard UI
│   └── page.tsx                  # Landing page
├── components/                   # Reusable React components
├── config/                       # Configuration files (contracts, env)
├── hooks/                        # Custom React hooks
├── services/
│   ├── vesuOracle.ts             # Vesu APY & price feed integration
│   ├── ekuboOracle.ts            # Ekubo APR integration
│   ├── positionTracker.ts        # User position & profit tracking
│   ├── priceFeed.ts              # Pragma price feed integration
│   ├── vesu.ts                   # Vesu protocol execution logic
│   ├── vesuVToken.ts             # Vesu vToken logic
│   └── web3/                     # Web3 utilities and protocol calls
├── utils/                        # Utility functions and constants
├── contracts/                    # Cairo smart contracts (if present)
└── public/
    ├── logo.png                  # Project logo
    └── agent-architecture.png    # Architecture diagram
``` 

## Tech Stack

- **Frontend**: Next.js 15.3.2, React 19.0.0
- **Styling**: Tailwind CSS, DaisyUI
- **Blockchain**: Starknet
- **State Management**: Zustand
- **Testing**: Vitest, Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- yarn
- A Starknet wallet (e.g., Argent X)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/YieldStark.git
cd YieldStark/packages/nextjs
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
yarn dev
```
The application will be available at `http://localhost:3000`

## 📚 Documentation

Detailed documentation is available in the `docs` directory:

- [Pragma Integration](docs/PRAGMA-INTEGRATION.md) - Details on data/price feed analysis
- [Architecture](docs/ARCHITECTURE.md) - System architecture and components
- [Development](docs/DEVELOPMENT.md) - Development setup and guidelines

## 📈 Performance

   -Up to 4x higher BTC yield compared to passive strategies
   
   -100% automated strategy rotation powered by real-time Pragma feeds
   
   -Rebalancing logic optimized for gas-efficiency and execution success

## 🛣 Roadmap

### Phase 1: Core Infrastructure (Current)
- [x] Vesu and Ekubo strategy integration
- [x] Statistical analysis engine
- [x] Pragma data feed connection
- [x] Minimalist frontend for deposits and tracking

### Phase 2: Advanced Features (Q3 2025)
- [ ] Mobile-friendly dashboard
- [ ] AI-powered rebalancing engine
- [ ]  BTC staking and performance analytics

## 👥 Target Users

1. **Bitcoin Maximalists**
   - Want to earn yield without leaving BTC
   - Prefer BTC-denominated returns over altcoins
   - Avoid complex DeFi exposure

2. **Long-term Holders**
   - Automated rebalancing
   - Risk management
   - Portfolio optimization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Starknet Foundation
- Vesu Protocol
- Ekubo Protocol
- Pragma Oracle 

---

<p align="center">Built with ❤️ for Starknet Re{ignite} Hackathon 2025</p> 
