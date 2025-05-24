# YieldStark Architecture

YieldStark is a modular, data-driven yield optimizer for Bitcoin (WBTC) on Starknet. Its architecture is designed for extensibility, security, and robust automation, enabling seamless integration of new protocols, data sources, and agent strategies.

---

## 1. High-Level System Overview

```plaintext
┌───────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ Pragma Feeds  │───▶│  Analysis Engine   │───▶│  Strategy Engine   │
│ Vesu API      │    │  - APY Calculation │    │  - Allocation      │
│ Ekubo API     │    │  - Risk Metrics    │    │  - Rebalancing     │
│ User Data     │    │  - Market Trends   │    │  - Execution Plan  │
└───────────────┘    └────────────────────┘    └────────────────────┘
         ▲                        │                        │
         │                        ▼                        ▼
┌───────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ User Actions  │    │   Risk Management  │    │ Performance &      │
│ - Deposits    │────▶   & Alerts         │────▶ Learning Module    │
│ - Withdrawals │    │   - Thresholds     │    │ - Backtesting      │
│ - Balances    │    │   - Notifications  │    │ - Optimization     │
└───────────────┘    └────────────────────┘    └────────────────────┘
```

---

## 2. Core Components

### 2.1 Data Collection Layer

- **Pragma Oracle**: Fetches on-chain BTC/USD price, APY, and historical data.
- **Protocol APIs**: Integrates with Vesu and Ekubo for protocol-specific yield and risk data.
- **User Portfolio**: Tracks user deposits, withdrawals, and balances.

### 2.2 Analysis Engine

- **APY & Risk Calculation**: Combines real-time and historical data to compute optimal yield and risk metrics.
- **Market Trends**: Analyzes trends using Pragma and protocol data.
- **Cost-Benefit Analysis**: Determines if rebalancing is beneficial after accounting for fees and slippage.

### 2.3 Strategy Engine (Agent)

- **Strategy Selection**: Chooses the best protocol or combination based on computed metrics.
- **Rebalancing Logic**: Executes rebalancing only if benefit exceeds a configurable threshold.
- **Execution Plan**: Prepares and sends transactions to Starknet contracts.

### 2.4 Risk Management & Alerts

- **Threshold Monitoring**: Watches for abnormal APY, price, or protocol events.
- **Notifications**: Alerts users or halts actions if risk is detected.

### 2.5 Performance & Learning Module

- **Backtesting**: Simulates strategies using historical data.
- **Performance Tracking**: Monitors realized yield and strategy effectiveness.
- **Adaptive Tuning**: Adjusts strategy parameters based on performance.

---

## 3. Codebase Structure

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

---

## 4. Data Flow

1. **User deposits WBTC** via the dashboard UI.
2. **Data Collection**: The system fetches real-time APY, price, and risk data from Pragma, Vesu, and Ekubo.
3. **Analysis Engine**: Computes optimal allocation and risk using the latest and historical data.
4. **Strategy Engine**: Decides whether to rebalance, and if so, which protocol(s) to allocate to.
5. **Execution**: Sends transactions to Starknet contracts for deposit, withdrawal, or rebalancing.
6. **Performance Module**: Tracks results, updates user dashboard, and feeds data back for future strategy improvement.

---

## 5. Key Integration Points

- **Pragma**: Used for BTC/USD price, APY, and historical data (see `docs/PRAGMA-INTEGRATION.md`).
- **Vesu/Ekubo**: Protocol-specific yield and risk data, as well as execution endpoints.
- **Starknet**: All on-chain actions (deposits, withdrawals, rebalancing) are executed via Starknet smart contracts.

---

## 6. Security & Extensibility

- **Non-custodial**: Users retain control of their assets; contracts are open-source and auditable.
- **Modular**: New protocols, data sources, or strategies can be added with minimal changes.
- **Configurable**: Risk thresholds, rebalancing intervals, and strategy parameters are easily adjustable.

---

## 7. Future Improvements

- **Multi-asset Support**: Extend to other assets beyond WBTC.
- **Advanced Risk Models**: Integrate more sophisticated risk metrics and anomaly detection.
- **Automated Governance**: Allow community-driven strategy and parameter updates.
- **Enhanced Analytics**: More detailed performance and risk dashboards for users.

---

**For more details on Pragma integration, see [`docs/PRAGMA-INTEGRATION.md`](./PRAGMA-INTEGRATION.md).**
