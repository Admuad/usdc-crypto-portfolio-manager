// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Portfolio Tracker
 * @notice Simplified portfolio tracking with USDC valuation
 * @dev Demonstrates multi-chain concept (would integrate oracles in production)
 */
contract PortfolioTracker {
    // USDC addresses on different chains (testnet examples)
    address public constant USDC_ETH = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // Sepolia USDC
    address public constant USDC_BASE = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // Base Sepolia USDC
    address public constant USDC_POLYGON = 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582; // Polygon Amoy USDC
    
    // Portfolio structure
    struct Portfolio {
        address owner;
        uint256 lastUpdated;
        uint256 totalValueUSD; // In USDC (6 decimals)
        ChainBalance[] chainBalances;
    }
    
    struct ChainBalance {
        uint256 chainId; // 1: Ethereum, 8453: Base, 137: Polygon
        uint256 nativeBalance; // In native token (wei)
        uint256 usdcBalance; // In USDC (6 decimals)
        uint256 timestamp;
    }
    
    // Mapping from owner to portfolio
    mapping(address => Portfolio) public portfolios;
    
    // Mock price oracle (would be Chainlink in production)
    uint256 public ethPriceUSD = 3000 * 1e6; // $3000 in USDC decimals
    uint256 public maticPriceUSD = 75 * 1e4; // $0.75 in USDC decimals
    
    event PortfolioUpdated(address indexed owner, uint256 totalValueUSD);
    event ChainAdded(address indexed owner, uint256 chainId, uint256 nativeBalance, uint256 usdcBalance);
    
    /**
     * @notice Update portfolio with chain balance
     * @param chainId Chain identifier (1: ETH, 8453: Base, 137: Polygon)
     * @param nativeBalance Balance in native token (wei)
     * @param usdcBalance Balance in USDC (6 decimals)
     */
    function updateChainBalance(
        uint256 chainId,
        uint256 nativeBalance,
        uint256 usdcBalance
    ) external {
        Portfolio storage portfolio = portfolios[msg.sender];
        
        // Convert native balance to USDC value
        uint256 nativeValueUSD = 0;
        
        if (chainId == 1 || chainId == 8453) { // Ethereum or Base
            nativeValueUSD = (nativeBalance * ethPriceUSD) / 1e18;
        } else if (chainId == 137) { // Polygon
            nativeValueUSD = (nativeBalance * maticPriceUSD) / 1e18;
        }
        
        // Add USDC balance (already in USDC)
        
        // Update or add chain balance
        bool chainExists = false;
        for (uint256 i = 0; i < portfolio.chainBalances.length; i++) {
            if (portfolio.chainBalances[i].chainId == chainId) {
                portfolio.chainBalances[i].nativeBalance = nativeBalance;
                portfolio.chainBalances[i].usdcBalance = usdcBalance;
                portfolio.chainBalances[i].timestamp = block.timestamp;
                chainExists = true;
                break;
            }
        }
        
        if (!chainExists) {
            portfolio.chainBalances.push(ChainBalance({
                chainId: chainId,
                nativeBalance: nativeBalance,
                usdcBalance: usdcBalance,
                timestamp: block.timestamp
            }));
        }
        
        // Recalculate total portfolio value
        uint256 totalUSD = 0;
        for (uint256 i = 0; i < portfolio.chainBalances.length; i++) {
            ChainBalance memory balance = portfolio.chainBalances[i];
            
            uint256 chainNativeValueUSD = 0;
            if (balance.chainId == 1 || balance.chainId == 8453) {
                chainNativeValueUSD = (balance.nativeBalance * ethPriceUSD) / 1e18;
            } else if (balance.chainId == 137) {
                chainNativeValueUSD = (balance.nativeBalance * maticPriceUSD) / 1e18;
            }
            
            totalUSD += chainNativeValueUSD + balance.usdcBalance;
        }
        
        portfolio.owner = msg.sender;
        portfolio.totalValueUSD = totalUSD;
        portfolio.lastUpdated = block.timestamp;
        
        emit PortfolioUpdated(msg.sender, totalUSD);
        emit ChainAdded(msg.sender, chainId, nativeBalance, usdcBalance);
    }
    
    /**
     * @notice Get portfolio summary
     */
    function getPortfolio(address owner) external view returns (
        uint256 totalValueUSD,
        uint256 lastUpdated,
        uint256 chainCount
    ) {
        Portfolio storage portfolio = portfolios[owner];
        return (
            portfolio.totalValueUSD,
            portfolio.lastUpdated,
            portfolio.chainBalances.length
        );
    }
    
    /**
     * @notice Get chain breakdown
     */
    function getChainBreakdown(address owner) external view returns (
        uint256[] memory chainIds,
        uint256[] memory chainValuesUSD,
        uint256[] memory timestamps
    ) {
        Portfolio storage portfolio = portfolios[owner];
        uint256 length = portfolio.chainBalances.length;
        
        chainIds = new uint256[](length);
        chainValuesUSD = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            ChainBalance memory balance = portfolio.chainBalances[i];
            chainIds[i] = balance.chainId;
            timestamps[i] = balance.timestamp;
            
            // Calculate chain value in USD
            uint256 nativeValueUSD = 0;
            if (balance.chainId == 1 || balance.chainId == 8453) {
                nativeValueUSD = (balance.nativeBalance * ethPriceUSD) / 1e18;
            } else if (balance.chainId == 137) {
                nativeValueUSD = (balance.nativeBalance * maticPriceUSD) / 1e18;
            }
            
            chainValuesUSD[i] = nativeValueUSD + balance.usdcBalance;
        }
        
        return (chainIds, chainValuesUSD, timestamps);
    }
    
    /**
     * @notice Calculate concentration risk (simplified)
     * @return riskScore 0-100, higher = more risk
     */
    function calculateRiskScore(address owner) external view returns (uint256 riskScore) {
        Portfolio storage portfolio = portfolios[owner];
        if (portfolio.chainBalances.length == 0) return 0;
        
        uint256 totalUSD = portfolio.totalValueUSD;
        if (totalUSD == 0) return 0;
        
        // Simple concentration risk: penalize if any chain > 50%
        for (uint256 i = 0; i < portfolio.chainBalances.length; i++) {
            ChainBalance memory balance = portfolio.chainBalances[i];
            
            uint256 chainValueUSD = 0;
            if (balance.chainId == 1 || balance.chainId == 8453) {
                chainValueUSD = (balance.nativeBalance * ethPriceUSD) / 1e18;
            } else if (balance.chainId == 137) {
                chainValueUSD = (balance.nativeBalance * maticPriceUSD) / 1e18;
            }
            
            chainValueUSD += balance.usdcBalance;
            
            uint256 percentage = (chainValueUSD * 100) / totalUSD;
            if (percentage > 50) {
                riskScore += 30; // High concentration penalty
            }
        }
        
        // USDC allocation bonus (more USDC = less risk)
        uint256 usdcBalance = 0;
        for (uint256 i = 0; i < portfolio.chainBalances.length; i++) {
            usdcBalance += portfolio.chainBalances[i].usdcBalance;
        }
        uint256 usdcPercentage = (usdcBalance * 100) / totalUSD;
        
        if (usdcPercentage >= 20) {
            riskScore = riskScore > 20 ? riskScore - 20 : 0;
        }
        
        return riskScore > 100 ? 100 : riskScore;
    }
    
    /**
     * @notice Update mock prices (admin function for demo)
     */
    function updatePrices(uint256 newEthPriceUSD, uint256 newMaticPriceUSD) external {
        ethPriceUSD = newEthPriceUSD;
        maticPriceUSD = newMaticPriceUSD;
    }
}
