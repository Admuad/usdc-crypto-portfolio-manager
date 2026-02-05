const { ethers } = require("ethers");
require("dotenv").config();

// Configuration
const RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PORTFOLIO_TRACKER_ADDRESS = "0x81fFDe8F07139d5B4aC04189FC12c980D4030372";
const AAVE_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

// ABI for LTV check (simplified)
const AAVE_POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];

async function monitorRisk() {
  console.log("🛡️ Risk Monitoring Agent Started...");
  console.log(`📡 Connected to RPC: ${RPC_URL}`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const aavePool = new ethers.Contract(AAVE_POOL_ADDRESS, AAVE_POOL_ABI, provider);

  setInterval(async () => {
    try {
      console.log(`\n🔍 [${new Date().toISOString()}] Checking portfolio health...`);
      
      const [
        totalCollateral,
        totalDebt,
        availableBorrows,
        liquidationThreshold,
        ltv,
        healthFactor
      ] = await aavePool.getUserAccountData(wallet.address);

      const ltvPercentage = Number(ltv) / 100;
      const hf = ethers.formatUnits(healthFactor, 18);

      console.log(`📊 Current LTV: ${ltvPercentage}%`);
      console.log(`❤️ Health Factor: ${hf}`);

      // Risk Logic: Threshold 80% LTV
      if (ltvPercentage > 80) {
        console.warn("🚨 RISK ALERT: LTV exceeded 80%! Initiating defensive rebalance...");
        await initiateDefensiveAction(wallet, totalDebt);
      } else {
        console.log("✅ Risk levels optimal.");
      }

    } catch (error) {
      console.error("❌ Monitoring Error:", error.message);
    }
  }, 30000); // Check every 30 seconds
}

async function initiateDefensiveAction(wallet, debtAmount) {
  console.log("🔄 DEFENSIVE ACTION: Repaying debt with USDC buffer...");
  // In a real scenario, this would call our PortfolioTracker contract
  // to swap assets for USDC and repay the Aave debt.
  console.log(`💰 Target Repayment: ${ethers.formatUnits(debtAmount, 8)} base units`);
  console.log("✅ Rebalance transaction simulated. (Waiting for mainnet deployment for execution)");
}

monitorRisk().catch(console.error);
