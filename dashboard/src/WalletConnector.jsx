import React, { useState, useEffect } from 'react';

const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('Sepolia Testnet');
  const [balance, setBalance] = useState('0.0');
  const [loading, setLoading] = useState(false);
  const [connectors] = useState([
    { id: 'metamask', name: 'MetaMask', icon: '🦊', color: '#F6851B' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', color: '#3B99FC' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '⚡', color: '#1652F0' },
    { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', color: '#00B2A5' },
    { id: 'okx', name: 'OKX Wallet', icon: '👾', color: '#000000' },
    { id: 'zerion', name: 'Zerion', icon: '🟣', color: '#2962EF' }
  ]);

  // Mock wallet connection
  const connectWallet = (walletType) => {
    setLoading(true);
    setShowWalletOptions(false);
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b...Fad7');
      setBalance('1,242.85');
      setNetwork('Sepolia Testnet');
      setLoading(false);
      
      console.log(`Connected to ${walletType}`);
    }, 933);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.0');
    setNetwork('');
    setShowWalletOptions(false);
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    // Could show toast notification here
    alert('Address copied to clipboard!');
  };

  const toggleWalletOptions = () => {
    setShowWalletOptions(!showWalletOptions);
  };

  // Close wallet options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.wallet-connector-wrapper')) {
        setShowWalletOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if already connected (from localStorage or similar)
    const savedConnection = localStorage.getItem('walletConnected');
    if (savedConnection === 'true') {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b...Fad7');
      setBalance('1,242.85');
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('walletConnected', 'true');
    } else {
      localStorage.removeItem('walletConnected');
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <div className="wallet-connector-wrapper">
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="wallet-network">
              <span className="network-indicator connected"></span>
              <span className="network-text">{network}</span>
            </div>
            <div className="wallet-address" onClick={copyAddress} title="Click to copy">
              <span className="address-icon">👛</span>
              <span className="address-text">{shortenAddress(walletAddress)}</span>
              <span className="copy-hint">📋</span>
            </div>
            <div className="wallet-balance">
              <span className="balance-amount">${balance}</span>
              <span className="balance-label">USDC</span>
            </div>
          </div>
          <div className="wallet-actions">
            <button className="btn btn-small btn-text" onClick={disconnectWallet}>
              Disconnect
            </button>
            <button className="btn btn-small btn-primary">
              Bridge Funds
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connector-wrapper">
      <div className="wallet-connect-button">
        <button className="btn btn-primary" onClick={toggleWalletOptions}>
          <span className="button-icon">🔗</span>
          Connect Wallet
        </button>
      </div>

      {showWalletOptions && (
        <div className="wallet-options-modal">
          <div className="modal-overlay" onClick={() => setShowWalletOptions(false)}></div>
          <div className="wallet-connector">
            <div className="connector-header">
              <div className="connector-title">
                <span className="title-icon">🔗</span>
                <h3>Connect Wallet</h3>
                <button className="close-button" onClick={() => setShowWalletOptions(false)}>×</button>
              </div>
              <div className="connector-subtitle">
                Connect your wallet to manage your USDC portfolio
              </div>
            </div>

            {loading ? (
              <div className="connecting-overlay">
                <div className="connecting-spinner"></div>
                <div className="connecting-text">Connecting to wallet...</div>
              </div>
            ) : (
              <div className="connector-grid">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    className="connector-card"
                    onClick={() => connectWallet(connector.id)}
                    style={{ '--connector-color': connector.color }}
                  >
                    <div className="connector-icon" style={{ backgroundColor: connector.color }}>
                      {connector.icon}
                    </div>
                    <div className="connector-name">{connector.name}</div>
                    <div className="connector-hint">Click to connect</div>
                  </button>
                ))}
              </div>
            )}

            <div className="connector-footer">
              <div className="security-note">
                <span className="security-icon">🔒</span>
                <span className="security-text">
                  Your wallet connection is secure. We never store your private keys.
                </span>
              </div>
              <div className="network-note">
                Currently connected to Sepolia Testnet. Switch to Mainnet for real funds.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;