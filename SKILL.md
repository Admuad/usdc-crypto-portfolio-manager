---
name: usdc-crypto-portfolio-manager
description: OpenClaw skill for managing crypto portfolios with USDC as base currency. Tracks balances, auto-rebalances, provides risk alerts, and executes DCA strategies across multiple chains.
version: 0.1.0
author: AdmuadClaw
---

# USDC Crypto Portfolio Manager

An OpenClaw skill that enables agents to autonomously manage cryptocurrency portfolios using USDC as the stable base currency.

## Problem Solved

Crypto investors struggle with:
- Portfolio tracking across multiple chains/wallets
- Rebalancing to maintain target allocations
- Managing risk (concentration, volatility)
- Executing Dollar Cost Averaging (DCA) strategies
- Tax optimization across trades

This skill solves these problems agentically, using USDC as the stable settlement layer.

## Features

### 1. Multi-Chain Portfolio Tracking
- **Supported Chains:** Ethereum, Base, Polygon, Arbitrum, Avalanche, Solana
- **Real-time balances:** USDC + top 50 tokens per chain
- **Portfolio valuation:** Convert all assets to USD value
- **Performance tracking:** Daily/weekly/monthly returns

### ,balance <wallet> [chain]
Checks portfolio balance for a wallet address.
- Optional chain parameter: if omitted, checks all supported chains
- Returns: token list, USD value, allocation percentages

### ,dca <token> <amount_usdc> <frequency>
Sets up Dollar Cost Averaging strategy.
- Example: `,dca ETH 100 7d` - Buy $100 of ETH every 7 days
- Creates smart contract for automatic execution
- Funds from connected USDC wallet

### ,rebalance <target_allocation_json>
Rebalances portfolio to target allocations.
- Example: `,rebalance {"ETH": 40, "USDC":52, "SOL":8}`
- Executes swaps via DEX aggregators
- Minimizes slippage and gas costs

### ,risk <wallet>
Analyzes portfolio risk factors.
- Concentration risk (single asset >20%)
- Volatility exposure
- Liquidity risk
- Smart contract risk for DeFi positions

### ,tax <wallet> <year>
Generates tax-optimized trade history.
- Identifies tax-loss harvesting opportunities
- FIFO/LIFO accounting methods
- Export to CSV for tax software

## Architecture

### Smart Contracts
1. **PortfolioTracker** - On-chain portfolio state
2. **DCAAgent** - Automated Dollar Cost Averaging
3. **Rebalancer** - One-click portfolio rebalancing
4. **RiskOracle** - Real-time risk assessment

### Skill Components
1. **Chain APIs** - Multi-chain RPC connections
2. **Price Oracles** - Real-time token pricing
3. **DEX Aggregator** - Best-price trade execution
4. **Risk Engine** - Portfolio risk scoring
5. **Reporting Module** - Performance and tax reports

## Why USDC?

- **Stability:** Portfolio value anchored to USD
- **Liquidity:** Highest liquidity stablecoin
- **Multi-chain:** Native on 10+ chains via CCTP
- **Trust:** Circle-regulated, audited reserves
- **Agent-native:** Programmable via smart contracts

## Installation

```bash
# Clone the skill
git clone https://github.com/admuad/usdc-crypto-portfolio-manager.git
cd usdc-crypto-portfolio-manager

# Install dependencies
npm install

# Configure chains
cp config.example.json config.json
# Edit config.json with your RPC endpoints

# Test the skill
npm test
```

## Configuration

Add to your OpenClaw config:

```json
{
  "skills": {
    "usdc-portfolio-manager": {
      "path": "/path/to/usdc-crypto-portfolio-manager",
      "wallets": {
        "ethereum": "0x...",
        "solana": "..."
      },
      "chains": ["ethereum", "base", "solana"],
      "risk_tolerance": "medium"
    }
  }
}
```

## Security

- **Testnet-only** for hackathon submission
- **No private keys** stored - uses wallet connections
- **Simulation mode** before execution
- **Gas optimization** for multi-chain operations
- **Audit trail** of all portfolio changes

## Development Status

### MVP (Hackathon Submission)
- [x] Multi-chain balance checking
- [x] Portfolio valuation in USD
- [x] Basic risk alerts
- [ ] DCA smart contract
- [ ] Rebalancing execution
- [ ] Tax reporting

### Future Roadmap
- DeFi yield optimization
- Cross-chain portfolio synchronization
- AI-powered allocation recommendations
- Institutional-grade reporting
- Regulatory compliance features

## Links

- **GitHub:** https://github.com/admuad/usdc-crypto-portfolio-manager
- **Demo:** (Coming soon)
- **Smart Contracts:** Base Sepolia testnet

## Why This Wins Track 2 (Best OpenClaw Skill)

1. **Practical utility** - Solves real crypto investor problems
2. **USDC integration** - Deep usage of USDC as base currency
3. **Multi-chain** - Works across EVM + Solana ecosystems
4. **Agent-native** - Designed for autonomous operation
5. **Commercial potential** - Clear path to monetization

Built by AdmuadClaw for the USDC Hackathon 2026.