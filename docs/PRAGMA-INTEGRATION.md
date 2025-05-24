# Pragma Integration with YieldStark

This document outlines how Pragma's on-chain price feeds and yield data have been integrated into the YieldStark system, enabling robust, data-driven yield optimization and rebalancing for BTC holders on Starknet.

## Architecture Overview
The integration follows a multi-layered approach:

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

## Key Components

1. **Pragma Oracle Client**
   - Fetches real-time, on-chain price and APY data for BTC and integrated protocols (Vesu, Ekubo)
   - **Provides BTC/USD price data for display in the YieldStark UI**
   - Provides decentralized, verifiable data for strategy decisions
   - Supports historical data queries for trend analysis

2. **Analysis Engine**
   - Combines Pragma data with protocol-specific APIs
   - Computes real-time APY, risk metrics, and market trends
   - Performs cost-benefit analysis for rebalancing

3. **Strategy Engine**
   - Selects optimal yield strategies based on Pragma and protocol data
   - Executes rebalancing and allocation logic
   - Manages execution plans and tracks performance

4. **Risk Management & Alerts**
   - Monitors risk thresholds using Pragma and protocol data
   - Issues alerts for abnormal market conditions or protocol risks
   - Supports rule-based and data-driven risk assessment

5. **Performance & Learning Module**
   - Tracks strategy effectiveness and yield performance
   - Analyzes historical and real-time signals
   - Provides recommendations for strategy improvements

## Implementation Details

### Dual-System Architecture
- **Pragma Oracle Integration**
  - Fetches on-chain price and APY data for BTC and supported protocols
  - **Fetches BTC/USD price for dashboard display**
  - Ensures data integrity and decentralization
- **Protocol Data Integration**
  - Combines Pragma data with Vesu and Ekubo APIs for comprehensive analysis
- **Validation Layer**
  - Validates strategy decisions using risk metrics and historical data
  - Can reject or adjust rebalancing actions based on risk assessment

### Asset-Specific Profiles
- Each supported asset (e.g., WBTC) has a profile with:
  - Custom risk thresholds
  - Relevant Pragma data feeds
  - Historical performance tracking

### Rebalancing Logic
- Minimum rebalancing interval (e.g., 7 days) to optimize for fees
- Cost-benefit analysis using Pragma APY and protocol data
- Minimum benefit threshold for execution (e.g., 2x expected yield improvement)

## Configuration
- Pragma API and network settings are stored in `config/contracts.ts` and related config files
- Strategy parameters and risk thresholds are configurable per asset
- Example:

```ts
// config/contracts.ts
export const CONTRACTS = {
  VESU: {
    SEPOLIA: {
      ORACLE: "0x...", // Pragma Oracle address
      WBTC_VAULT: "0x..."
    }
  },
  EKUBO: {
    SEPOLIA: {
      WBTC_VAULT: "0x..."
    }
  }
};
```

## Usage in YieldStark
- Pragma integration is used in the following modules:
  - `services/vesuOracle.ts`: Fetches APY and price data from Pragma
  - `services/ekuboOracle.ts`: Fetches APR data
  - `services/priceFeed.ts`: **Fetches real-time BTC/USD price data for display using Pragma's API**
  - `app/dashboard/page.tsx`: Orchestrates data fetching and strategy execution, including BTC price display
- Example usage for BTC price display:

```ts
// services/priceFeed.ts
const PRAGMA_API_URL = 'https://api.devnet.pragma.build/node/v1';

// Fetch BTC/USD price for display
async function fetchBTCPrice() {
  const response = await fetch(`${PRAGMA_API_URL}/btc-usd/price`);
  const data = await response.json();
  return data.price;
}
```

## API Endpoint
- **Pragma API Endpoint Used:**  
  `https://api.devnet.pragma.build/node/v1`

  This endpoint is used for fetching both yield and price data, including real-time BTC/USD prices for display in the YieldStark dashboard.

## Architecture Decisions

- **Decentralized Data Feeds**: Pragma is used for its on-chain, verifiable data, reducing reliance on centralized oracles.
- **Multi-Layer Validation**: Strategy decisions are validated using both real-time and historical data.
- **Asset-Specific Profiling**: Each asset uses custom thresholds and data feeds for optimal risk/yield management.

## Future Improvements

- **Forward Testing Framework**: Simulate rebalancing using Pragma data to refine strategies
- **Enhanced Risk Metrics**: Integrate additional risk signals from Pragma and protocol APIs
- **Dynamic Thresholds**: Automatically adjust rebalancing and risk thresholds based on market conditions and performance
