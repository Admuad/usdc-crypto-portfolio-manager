import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [balance, setBalance] = useState('124,592.84');
  const [yieldHarvested, setYieldHarvested] = useState('1,240.12');
  
  return (
    <div className="app-container">
      <header>
        <div className="logo">USDC<span>Architect</span></div>
        <div className="badge"><span className="live-indicator"></span>Sepolia Testnet Live</div>
      </header>

      <main className="bento-grid">
        {/* Main Balance Card */}
        <div className="card span-8 row-2">
          <span className="label">Total Asset Value (USDC)</span>
          <div className="value">${balance}</div>
          <div className="change up">▲ 4.2% (+$5,120.30) Today</div>
          <div className="chart-preview">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <path 
                d="M0,150 C100,140 200,160 300,120 S500,40 600,60 S800,20 1000,40 L1000,200 L0,200 Z" 
                fill="url(#gradient)" 
                opacity="0.3"
              />
              <path 
                d="M0,150 C100,140 200,160 300,120 S500,40 600,60 S800,20 1000,40" 
                stroke="#7E54F1" 
                strokeWidth="4" 
                fill="none"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#7E54F1', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#7E54F1', stopOpacity:0}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Yield Card */}
        <div className="card span-4">
          <span className="label">Yield Harvested (Aave V3)</span>
          <div className="value">${yieldHarvested}</div>
          <div className="change up">▲ 12.5% APY</div>
        </div>

        {/* Risk Profile Card */}
        <div className="card span-4">
          <span className="label">Risk Engine Status</span>
          <div className="value">OPTIMAL</div>
          <div className="change warning">LTV: 42% (Limit 80%)</div>
        </div>

        {/* Active Streams Card */}
        <div className="card span-12">
          <span className="label">Active Continuous DCA Streams</span>
          <div style={{marginTop: '20px'}}>
            <div className="stream-item">
              <div>
                <div style={{fontWeight: 600}}>ETH Stream</div>
                <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>0.5 ETH/day</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 700}}>$500.00 / Day</div>
                <div className="badge">Streaming</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '65%'}}></div>
            </div>
          </div>
          
          <div style={{marginTop: '30px'}}>
            <div className="stream-item">
              <div>
                <div style={{fontWeight: 600}}>SOL Stream</div>
                <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>12.4 SOL/day</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 700}}>$250.00 / Day</div>
                <div className="badge">Streaming</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '30%', background: '#17854F'}}></div>
            </div>
          </div>
        </div>

        {/* Multi-chain Summary */}
        <div className="card span-6">
          <span className="label">Multi-Chain Distribution</span>
          <div style={{marginTop: '20px', display: 'flex', gap: '15px'}}>
             <div style={{flex: 1, padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Ethereum</div>
                <div style={{fontSize: '18px', fontWeight: 700}}>$82,401</div>
             </div>
             <div style={{flex: 1, padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Base</div>
                <div style={{fontSize: '18px', fontWeight: 700}}>$42,191</div>
             </div>
          </div>
        </div>

        {/* Real-time Events */}
        <div className="card span-6">
          <span className="label">Agent Audit Log</span>
          <div style={{marginTop: '20px', fontSize: '13px'}}>
            <div style={{marginBottom: '10px', color: 'var(--brand-emerald)'}}>● [06:09 UTC] Successfully deployed to Sepolia</div>
            <div style={{marginBottom: '10px'}}>● [06:05 UTC] Harvested $1.24 yield from Aave</div>
            <div style={{marginBottom: '10px'}}>● [05:58 UTC] Risk engine verified 100% collateralized</div>
          </div>
        </div>
      </main>
      
      <footer style={{marginTop: '60px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px'}}>
        USDC Portfolio Manager — Hackathon Edition 2026 — Built with ❤️ by AdmuadClaw
      </footer>
    </div>
  );
}

export default App;
