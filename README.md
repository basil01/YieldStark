# YieldStark 🚀

An AI-powered automated yield optimization agent for BTC deposits on Starknet, built for the Starknet ReIgnite hackathon.

## Overview

YieldStark automatically finds and rotates your BTC deposits between Vesu and Ekubo protocols to maximize your yield. The system uses an AI-powered strategy to determine the optimal protocol based on current yields and market conditions.

### Key Features

- 🤖 AI-powered yield optimization
- 🔄 Automatic rotation between Vesu and Ekubo
- 📊 Real-time yield monitoring
- 🔒 Secure vault management
- ⚡ Gas-efficient strategy execution

## Architecture

The project consists of two main smart contracts:

1. **YieldStarkVault**: Main vault contract that handles:
   - BTC deposits and withdrawals
   - Integration with Vesu and Ekubo protocols
   - Strategy execution

2. **YieldStarkAI**: AI strategy contract that:
   - Monitors yields from both protocols
   - Makes optimization decisions
   - Updates strategy parameters

## Getting Started

### Prerequisites

- Node.js (v18.17 or later)
- Yarn
- Starknet CLI tools
- Cairo development environment

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yieldstark.git
   cd yieldstark
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Development

1. Start the local development chain:
   ```bash
   yarn chain
   ```

2. Deploy contracts:
   ```bash
   yarn deploy
   ```

3. Start the frontend:
   ```bash
   yarn start
   ```

## Smart Contracts

### YieldStarkVault

The main vault contract that manages user deposits and strategy execution.

```cairo
fn deposit(ref self: ContractState, amount: u256)
fn withdraw(ref self: ContractState, amount: u256)
fn optimize_yield(ref self: ContractState)
```

### YieldStarkAI

The AI strategy contract that makes optimization decisions.

```cairo
fn get_optimal_strategy(
    self: @ContractState,
    vesu_yield: u256,
    ekubo_yield: u256,
    current_strategy: u8,
) -> u8
```

## Testing

Run the test suite:
```bash
yarn test
```

## Deployment

1. Configure network settings in `scaffold.config.ts`
2. Deploy to testnet:
   ```bash
   yarn deploy --network sepolia
   ```

## Security

- All contracts are thoroughly tested
- Strategy changes have cooldown periods
- Owner-only parameter updates
- Minimum yield difference thresholds

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Starknet Foundation
- Vesu Protocol
- Ekubo Protocol
- All contributors and supporters
