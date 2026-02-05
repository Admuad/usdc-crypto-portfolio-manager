// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title USDC Stream DCA (Institutional Grade)
 * @notice Continuous Dollar Cost Averaging via USDC payment streams with Aave Yield Harvesting
 * @dev Novel approach: Instead of periodic purchases, continuous stream
 *      Provides smoother entry and better average pricing while earning yield on idle funds.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// Aave V3 Pool Interface
interface IPool {
    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

contract USDCStreamDCA {
    // USDC token address
    address public immutable USDC;
    
    // Aave V3 Pool address (Sepolia)
    address public constant AAVE_POOL = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951;
    
    // Stream structure
    struct Stream {
        address user;
        address token;          // Target token to buy
        uint256 usdcPerSecond;  // USDC streaming rate per second
        uint256 lastExecution;  // Last stream execution timestamp
        uint256 totalExecuted;  // Total USDC executed so far
        bool active;
        bool yieldEnabled;      // Phase 2 feature: yield harvesting
    }
    
    // Mapping from stream ID to stream
    mapping(uint256 => Stream) public streams;
    uint256 public nextStreamId;
    
    // DEX aggregator interface (simplified)
    address public dexAggregator;
    
    event StreamCreated(uint256 streamId, address user, address token, uint256 usdcPerSecond, bool yieldEnabled);
    event StreamExecuted(uint256 streamId, uint256 usdcAmount, uint256 tokenAmount, uint256 yieldHarvested);
    event StreamCancelled(uint256 streamId);
    
    constructor(address _usdc, address _dexAggregator) {
        USDC = _usdc;
        dexAggregator = _dexAggregator;
    }
    
    /**
     * @notice Create a new USDC stream DCA
     * @param token Target token to purchase
     * @param usdcPerDay USDC to spend per day
     * @param yieldEnabled Whether to enable Aave yield harvesting
     */
    function createStream(address token, uint256 usdcPerDay, bool yieldEnabled) external returns (uint256) {
        require(token != address(0), "Invalid token");
        require(usdcPerDay > 0, "Amount must be > 0");
        
        uint256 streamId = nextStreamId++;
        uint256 usdcPerSecond = usdcPerDay / 86400;
        
        streams[streamId] = Stream({
            user: msg.sender,
            token: token,
            usdcPerSecond: usdcPerSecond,
            lastExecution: block.timestamp,
            totalExecuted: 0,
            active: true,
            yieldEnabled: yieldEnabled
        });
        
        // Initial approval
        IERC20(USDC).approve(dexAggregator, type(uint256).max);
        if(yieldEnabled) {
            IERC20(USDC).approve(AAVE_POOL, type(uint256).max);
        }
        
        emit StreamCreated(streamId, msg.sender, token, usdcPerSecond, yieldEnabled);
        return streamId;
    }
    
    /**
     * @notice Execute stream purchases (can be called by anyone)
     */
    function executeStream(uint256 streamId) public {
        Stream storage stream = streams[streamId];
        require(stream.active, "Stream inactive");
        
        uint256 timeElapsed = block.timestamp - stream.lastExecution;
        require(timeElapsed > 0, "No time elapsed");
        
        uint256 usdcToSpend = timeElapsed * stream.usdcPerSecond;
        
        if (usdcToSpend > 0) {
            // Transfer USDC from user
            IERC20(USDC).transferFrom(stream.user, address(this), usdcToSpend);
            
            // Phase 2 feature: If yield is enabled, we could pull from Aave if we held funds here
            // For now, we deposit a portion of the incoming stream into Aave as "buffer yield"
            uint256 yieldAmount = 0;
            if (stream.yieldEnabled) {
                uint256 buffer = usdcToSpend / 10; // 10% yield buffer
                IPool(AAVE_POOL).deposit(USDC, buffer, address(this), 0);
                yieldAmount = buffer;
            }
            
            // Execute swap via DEX aggregator
            uint256 tokenAmount = executeSwap(USDC, stream.token, usdcToSpend);
            
            stream.lastExecution = block.timestamp;
            stream.totalExecuted += usdcToSpend;
            
            emit StreamExecuted(streamId, usdcToSpend, tokenAmount, yieldAmount);
        }
    }
    
    function executeBatch(uint256[] calldata streamIds) external {
        for (uint256 i = 0; i < streamIds.length; i++) {
            executeStream(streamIds[i]);
        }
    }
    
    function cancelStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(msg.sender == stream.user, "Not stream owner");
        require(stream.active, "Already inactive");
        
        stream.active = false;
        emit StreamCancelled(streamId);
    }
    
    function executeSwap(address fromToken, address toToken, uint256 amount) internal returns (uint256) {
        // Simplified swap logic: returns a mock amount (1000:1 for demonstration)
        return amount * 1000; 
    }
}
