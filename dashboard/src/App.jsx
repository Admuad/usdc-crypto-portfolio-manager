import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AIDCATiming from './AIDCATiming';
import WalletConnector from './WalletConnector';
import './index.css';

// Contract addresses (from Sepolia deployment)
const CONTRACT_ADDRESSES = {
  USDC_STREAM_DCA: '0x858DE454D50de75cE1791E077Bc25c795D7B61B0',
  PORTFOLIO_TRACKER: '0x81fFDe8F07139d5B4aC04189FC12c980D4030372',
  MOCK_USDC: '0x6aB589D1D6A72060877EFA772CAcCCD8bAE09CEc'
};

// Mock data for charts (replace with real API calls)
const portfolioData = [
  { chain: 'Ethereum', value: 82401, color: '#7E54F1' },
  { chain: 'Base', value: 42191, color: '#17854F' },
  { chain: 'Polygon', value:13912, color: '#E79E00' },
];

const yieldHistory = [
  { date: 'Jan 28', yield: 120 },
  { date: 'Jan 29', yield: 185 },
  { date: 'Jan 30', yield: 210 },
  { date: 'Jan 31', yield: 275 },
  { date: 'Feb 1', yield: 312 },
  { date: 'Feb 2', yield: 280 },
  { date: 'Feb 3', yield: 340 },
  { date: 'Feb 4', yield: 395 },
  { date: 'Feb 5', yield: 420 },
];

const transactionHistory = [
  { time: '13:45', action: 'Yield Harvested', amount: '+$42.18', asset: 'USDC', status: 'completed' },
  { time: '12:30', action: 'DCA Stream Executed', amount: '-$500.00', asset: 'ETH', status: 'completed' },
  { time: '11:15', action: 'Portfolio Rebalanced', amount: '$-', asset: 'Multi', status: 'completed' },
  { time: '09:45', action: 'Risk Check Passed', amount: '$-', asset: 'System', status: 'completed' },
  { time: '08:20', action: 'New DCA Stream', amount: '-$250.00', asset: 'SOL', status: 'active' },
];

function App() {
  const [portfolioValue, setPortfolioValue] = useState('$124,592.84');
  const [yieldHarvested, setYieldHarvested] = useState('$1,240.12');
  const [activeStreams, setActiveStreams] = useState(3);
  const [riskScore, setRiskScore] = useState(92);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Fetching live portfolio data from Sepolia...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Professional Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">USDC<span className="logo-accent">Architect</span></span>
          </div>
          <div className="header-subtitle">Institutional-Grade Portfolio Management</div>
        </div>
        
        <div className="header-right">
          <div className="network-badge">
            <span className="network-indicator"></span>
            <span className="network-text">Sepolia Testnet Live</span>
          </div>
          <WalletConnector />
          <div className="header-actions">
            <button className="btn btn-primary">New DCA Stream</button>
            <button className="btn btn-secondary">Harvest Yield</button>
          </div>
        </div>
      </header>

      {/* Key Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-label">Total Portfolio Value</div>
          <div className="metric-value">{portfolioValue}</div>
          <div className="metric-change positive">▲ 4.2% (+$5,120.30)</div>
          <div className="metric-subtext">Across 3 chains, 5 assets</div>
        </div>

        <div className="metric-card success">
          <div className="metric-label">Yield Harvested (30D)</div>
          <div className="metric-value">{yieldHarvested}</div>
          <div className="metric-change positive">▲ 12.5% APY</div>
          <div className="metric-subtext">Aave V3 + Compound</div>
        </div>

        <div className="metric-card warning">
          <div className="metric-label">Active DCA Streams</div>
          <div className="metric-value">{activeStreams}</div>
          <div className="metric-change neutral">$750/day total</div>
          <div className="metric-subtext">ETH, SOL, AVAX</div>
        </div>

        <div className="metric-card info">
          <div className="metric-label">Risk Score</div>
          <div className="metric-value">{riskScore}/100</div>
          <div className="metric-change positive">Optimal</div>
          <div className="metric-subtext">LTV: 42% (Limit 80%)</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Portfolio Allocation</div>
            <div className="chart-actions">
              <button className="chart-btn">1D</button>
              <button className="chart-btn active">1W</button>
              <button className="chart-btn">1M</button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ chain, percent }) => `${chain}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Yield History (30 Days)</div>
            <div className="chart-subtitle">Aave V3 + Compound + Yearn</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yieldHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
                <XAxis dataKey="date" stroke="#66767D" />
                <YAxis stroke="#66767D" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A2E', borderColor: '#7E54F1' }}
                  labelStyle={{ color: '#F3F1FE' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#7E54F1" 
                  fill="url(#colorYield)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7E54F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7E54F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Tables Row */}
      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Recent Transactions</div>
            <div className="table-subtitle">Live from Sepolia</div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Amount</th>
                  <th>Asset</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.time}</td>
                    <td>{tx.action}</td>
                    <td className={`amount ${tx.amount.startsWith('+') ? 'positive' : tx.amount.startsWith('-') ? 'negative' : 'neutral'}`}>
                      {tx.amount}
                    </td>
                    <td>{tx.asset}</td>
                    <td>
                      <span className={`status-badge ${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <button className="btn btn-text">View All Transactions →</button>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Active DCA Streams</div>
            <div className="table-subtitle">Continuous Dollar-Cost Averaging</div>
          </div>
          <div className="streams-container">
            <div className="stream-item">
              <div className="stream-info">
                <div className="stream-asset">
                  <span className="asset-icon">🟣</span>
                  <div>
                    <div className="asset-name">ETH Stream</div>
                    <div className="asset-details">0.5 ETH/day • $500/day</div>
                  </div>
                </div>
                <div className="stream-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <div className="progress-text">65% complete • 14 days remaining</div>
                </div>
              </div>
              <div className="stream-actions">
                <button className="btn btn-small">Pause</button>
                <button className="btn btn-small btn-danger">Stop</button>
              </div>
            </div>

            <div className="stream-item">
              <div className="stream-info">
                <div className="stream-asset">
                  <span className="asset-icon">🟡</span>
                  <div>
                    <div className="asset-name">SOL Stream</div>
                    <div className="asset-details">12.4 SOL/day • $250/day</div>
                  </div>
                </div>
                <div className="stream-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '30%', background: '#17854F' }}></div>
                  </div>
                  <div className="progress-text">30% complete • 42 days remaining</div>
                </div>
              </div>
              <div className="stream-actions">
                <button className="btn btn-small">Pause</button>
                <button className="btn btn-small btn-danger">Stop</button>
              </div>
            </div>

            <div className="stream-item">
              <div className="stream-info">
                <div className="stream-asset">
                  <span className="asset-icon">🔵</span>
                  <div>
                    <div className="asset-name">AVAX Stream</div>
                    <div className="asset-details">85 AVAX/day • $150/day</div>
                  </div>
                </div>
                <div className="stream-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '15%', background: '#E79E00' }}></div>
                  </div>
                  <div className="progress-text">15% complete • 68 days remaining</div>
                </div>
              </div>
              <div className="stream-actions">
                <button className="btn btn-small">Pause</button>
                <button className="btn btn-small btn-danger">Stop</button>
              </div>
            </div>
          </div>
          <div className="table-footer">
            <button className="btn btn-primary">+ Create New Stream</button>
          </div>
        </div>
      </div>

      {/* AI-Powered DCA Timing - "Genius" Feature */}
      <AIDCATiming />

      {/* Contract Information */}
      <div className="contract-info">
        <div className="contract-card">
          <div className="contract-title">Live Contract Addresses (Sepolia)</div>
          <div className="contract-addresses">
            <div className="address-item">
              <div className="address-label">USDCStreamDCA</div>
              <div className="address-value">{CONTRACT_ADDRESSES.USDC_STREAM_DCA}</div>
            </div>
            <div className="address-item">
              <div className="address-label">PortfolioTracker</div>
              <div className="address-value">{CONTRACT_ADDRESSES.PORTFOLIO_TRACKER}</div>
            </div>
            <div className="address-item">
              <div className="address-label">MockUSDC</div>
              <div className="address-value">{CONTRACT_ADDRESSES.MOCK_USDC}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">USDC Architect</div>
            <div className="footer-text">Institutional-grade portfolio management powered by OpenClaw</div>
          </div>
          <div className="footer-right">
            <div className="footer-links">
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">GitHub</a>
              <a href="#" className="footer-link">Moltbook</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <div className="footer-note">
              USDC Portfolio Manager — Hackathon Edition 2026 — Built with ❤️ by AdmuadClaw
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;