// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title USDC Stream DCA
 * @notice Continuous Dollar Cost Averaging via USDC payment streams
 * @dev Novel approach: Instead of periodic purchases, continuous stream
 *      Provides smoother entry and better average pricing
 */
contract USDCStreamDCA {
    // USDC token address (mainnet)
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    
    // Stream structure
    struct Stream {
        address user;
        address token;          // Target token to buy
        uint256 usdcPerSecond;  // USDC streaming rate per second
        uint256 lastExecution;  // Last stream execution timestamp
        uint256 totalExecuted;  // Total USDC executed so far
        bool active;
    }
    
    // Mapping from stream ID to stream
    mapping(uint256 => Stream) public streams;
    uint256 public nextStreamId;
    
    // DEX aggregator interface (simplified)
    address public dexAggregator;
    
    event StreamCreated(uint256 streamId, address user, address token, uint256 usdcPerSecond);
    event StreamExecuted(uint256 streamId, uint256 usdcAmount, uint256 tokenAmount);
    event StreamCancelled(uint256 streamId);
    
    constructor(address _dexAggregator) {
        dexAggregator = _dexAggregator;
    }
    
    /**
     * @notice Create a new USDC stream DCA
     * @param token Target token to purchase
     * @param usdcPerDay USDC to spend per day (converted to per second)
     */
    function createStream(address token, uint256 usdcPerDay) external returns (uint256) {
        require(token != address(0), "Invalid token");
        require(usdcPerDay > 0, "Amount must be > 0");
        
        uint256 streamId = nextStreamId++;
        
        // Convert USDC per day to per second (86400 seconds per day)
        uint256 usdcPerSecond = usdcPerDay / 86400;
        
        streams[streamId] = Stream({
            user: msg.sender,
            token: token,
            usdcPerSecond: usdcPerSecond,
            lastExecution: block.timestamp,
            totalExecuted: 0,
            active: true
        });
        
        // Approve USDC spending
        IERC20(USDC).approve(dexAggregator, type(uint256).max);
        
        emit StreamCreated(streamId, msg.sender, token, usdcPerSecond);
        return streamId;
    }
    
    /**
     * @notice Execute stream purchases (can be called by anyone)
     * @dev Gas-efficient batch execution possible
     */
    function executeStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(stream.active, "Stream inactive");
        
        uint256 timeElapsed = block.timestamp - stream.lastExecution;
        require(timeElapsed > 0, "No time elapsed");
        
        // Calculate USDC to spend
        uint256 usdcToSpend = timeElapsed * stream.usdcPerSecond;
        
        if (usdcToSpend > 0) {
            // Transfer USDC from user to contract
            IERC20(USDC).transferFrom(stream.user, address(this), usdcToSpend);
            
            // Execute swap via DEX aggregator
            uint256 tokenAmount = executeSwap(USDC, stream.token, usdcToSpend);
            
            // Update stream state
            stream.lastExecution = block.timestamp;
            stream.totalExecuted += usdcToSpend;
            
            emit StreamExecuted(streamId, usdcToSpend, tokenAmount);
        }
    }
    
    /**
     * @notice Execute multiple streams in batch (gas optimization)
     */
    function executeBatch(uint256[] calldata streamIds) external {
        for (uint256 i = 0; i < streamIds.length; i++) {
            executeStream(streamIds[i]);
        }
    }
    
    /**
     * @notice Cancel a stream
     */
    function cancelStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(msg.sender == stream.user, "Not stream owner");
        require(stream.active, "Already inactive");
        
        stream.active = false;
        emit StreamCancelled(streamId);
    }
    
    /**
     * @notice Get stream stats
     */
    function getStreamStats(uint256 streamId) external view returns (
        address user,
        address token,
        uint256 usdcPerSecond,
        uint256 lastExecution,
        uint256 totalExecuted,
        bool active,
        uint256 pendingUsdc
    ) {
        Stream storage stream = streams[streamId];
        uint256 timeElapsed = block.timestamp - stream.lastExecution;
        uint256 pending = timeElapsed * stream.usdcPerSecond;
        
        return (
            stream.user,
            stream.token,
            stream.usdcPerSecond,
            stream.lastExecution,
            stream.totalExecuted,
            stream.active,
            pending
        );
    }
    
    /**
     * @notice Simulated DEX swap execution
     * @dev In production, would integrate with 1inch, 0x, etc.
     */
    function executeSwap(address fromToken, address toToken, uint256 amount) internal returns (uint256) {
        // Simplified swap logic
        // In reality: call dexAggregator.swap(fromToken, toToken, amount)
        return amount * 1000; // Mock conversion rate
    }
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}