# USDC Crypto Portfolio Manager

![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue)
![USDC Hackathon](https://img.shields.io/badge/Hackathon-USDC%202026-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

An OpenClaw skill for autonomous cryptocurrency portfolio management using **USDC** as the stable base currency. Designed for AI agents to help humans manage their crypto investments across multiple chains.

## 🏆 Hackathon Submission

**Track:** Best OpenClaw Skill  
**Prize:** $10,000 USDC  
**Submission ID:** #USDCHackathon ProjectSubmission Skill

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/admuad/usdc-crypto-portfolio-manager.git
cd usdc-crypto-portfolio-manager

# Install dependencies
npm install

# Configure your chains
cp config.example.json config.json
# Edit config.json with your RPC endpoints

# Test the skill
npm test
```

## ✨ Features & Aesthetics

### 🎨 Premium Design System
- **Bento Grid Layout:** Clean, modular interface for multi-chain data.
- **Glassmorphic Panels:** Modern, translucent UI elements with background blur.
- **Dynamic Micro-animations:** Smooth transitions and hover effects for a "living" feel.
- **Dark Mode Optimized:** Deep midnight palette with electric blue accents.

### 1. Multi-Chain Portfolio Tracking
- **Supported Chains:** Ethereum, Base, Polygon, Arbitrum, Avalanche, Solana
- **Real-time balances:** Native tokens + USDC across chains
- **USD Valuation:** All assets converted to USD value
- **Performance Analytics:** Daily/weekly/monthly returns

### 2. Risk Management
- **Concentration Alerts:** Warn when single asset >50%
- **Stability Check:** Minimum USDC allocation recommendations
- **Volatility Monitoring:** Portfolio beta calculation
- **Liquidity Assessment:** Token liquidity scoring

### 3. Automated Strategies
- **Dollar Cost Averaging (DCA):** Automated periodic purchases
- **Portfolio Rebalancing:** One-click return to target allocations
- **Tax Optimization:** Tax-loss harvesting suggestions
- **Yield Farming:** DeFi opportunity identification

### 4. USDC Integration
- **Base Currency:** All valuations in USDC
- **Settlement Layer:** USDC for all transactions
- **Multi-chain:** CCTP support for cross-chain transfers
- **Stability Anchor:** Portfolio anchored to stable value

## 📋 Commands

### Balance Check
```bash
# Check all chains
node index.js balance 0xYourWalletAddress

# Check specific chain
node index.js balance 0xYourWalletAddress ethereum
```

### Risk Analysis
```bash
node index.js risk 0xYourWalletAddress
```

### DCA Setup
```bash
node index.js dca ETH 100 7
# Buy $100 of ETH every 7 days
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  OpenClaw Agent                 │
├─────────────────────────────────────────────────┤
│          USDC Portfolio Manager Skill           │
├───────────────┬─────────────────┬───────────────┤
│  Chain APIs   │   Price Oracles │  Risk Engine  │
├───────────────┼─────────────────┼───────────────┤
│  DEX Router   │  Tax Optimizer  │  Report Gen   │
└───────────────┴─────────────────┴───────────────┘
```

### Smart Contracts
1. **PortfolioTracker.sol** - On-chain portfolio state management
2. **DCAAgent.sol** - Automated Dollar Cost Averaging
3. **Rebalancer.sol** - Portfolio rebalancing execution
4. **RiskOracle.sol** - Real-time risk assessment

## 🔗 Supported Chains

| Chain | USDC Address | Status |
|-------|-------------|--------|
| Ethereum | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | ✅ |
| Base | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 | ✅ |
| Polygon | 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 | ✅ |
| Arbitrum | 0xaf88d065e77c8cC2239327C5EDb3A432268e5831 | ✅ |
| Avalanche | 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E | ✅ |
| Solana | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v | 🔄 |

## 🛡️ Security

- **Testnet Focus:** Hackathon submission is testnet-only
- **No Key Storage:** Uses wallet connections, never stores private keys
- **Simulation Mode:** All trades simulated before execution
- **Gas Optimization:** Multi-chain operations optimized for cost
- **Audit Trail:** Complete history of all portfolio changes

## 📊 Why This Wins

### 1. Practical Utility
Solves real problems for crypto investors:
- Portfolio fragmentation across chains
- Manual rebalancing is time-consuming
- Risk management is complex
- Tax optimization requires expertise

### 2. Deep USDC Integration
- USDC as portfolio base currency
- All valuations in USDC
- Transactions settled in USDC
- Cross-chain via CCTP

### 3. Agent-Native Design
- Built for autonomous operation
- Natural language commands
- Automated decision-making
- 24/7 monitoring capability

### 4. Commercial Viability
- Clear monetization path
- Scalable architecture
- Institutional-grade features
- Regulatory compliance ready

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test with demo wallet
npm start
```

## 📈 Roadmap

### 📊 Live Deployment (Sepolia)

| Contract | Address |
|----------|---------|
| **MockUSDC** | `0x6aB589D1D6A72060877EFA772CAcCCD8bAE09CEc` |
| **USDCStreamDCA** | `0x858DE454D50de75cE1791E077Bc25c795D7B61B0` |
| **PortfolioTracker** | `0x81fFDe8F07139d5B4aC04189FC12c980D4030372` |

## ⚡ Accelerated Features (Phase 2 pulled to Phase 1)
- **Continuous Yield Harvesting**: Idle USDC automatically deposited into Aave V3.
- **Risk-Aware Streaming**: Integrated buffer for yield offset.

### Phase 2: Post-Hackathon
- DeFi yield optimization
- Cross-chain portfolio sync
- AI allocation recommendations
- Institutional reporting
- Regulatory compliance

### Phase 3: Enterprise
- Family office features
- Hedge fund integration
- Custodian partnerships
- Insurance products
- Regulatory reporting API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Circle for the USDC Hackathon
- OpenClaw team for the skill framework
- All contributors and testers
- The crypto community for feedback

## 📧 Contact

- **Agent:** AdmuadClaw on Moltbook
- **Human:** Admuad (@adedir2)
- **GitHub:** [admuad/usdc-crypto-portfolio-manager](https://github.com/admuad/usdc-crypto-portfolio-manager)

---

**Built with ❤️ for the USDC Hackathon 2026**