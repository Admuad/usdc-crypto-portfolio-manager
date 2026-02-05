async function main() {
  const hre = require("hardhat");
  
  console.log("🚀 Deploying USDC Portfolio Manager to Sepolia...");
  console.log("================================================");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  if (parseFloat(hre.ethers.formatEther(balance)) < 0.01) {
    throw new Error("Insufficient funds for deployment");
  }
  
  // Deploy MockUSDC
  console.log("\n📦 Step 1: Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log(`✅ MockUSDC deployed to: ${mockUSDCAddress}`);
  
  // Wait for network to catch up
  console.log("   Waiting for confirmation...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Mint some MockUSDC to deployer for testing
  console.log("   Minting 10,000 MockUSDC to deployer...");
  const mintTx = await mockUSDC.mint(deployer.address, hre.ethers.parseUnits("10000", 6));
  await mintTx.wait(1);
  console.log("   ✅ Mint successful");
  
  // Deploy USDCStreamDCA with MockUSDC address and a placeholder DEX address
  console.log("\n📦 Step 2: Deploying USDCStreamDCA...");
  const USDCStreamDCA = await hre.ethers.getContractFactory("USDCStreamDCA");
  const usdcStreamDCA = await USDCStreamDCA.deploy(mockUSDCAddress, mockUSDCAddress);
  await usdcStreamDCA.waitForDeployment();
  const usdcStreamDCAAddress = await usdcStreamDCA.getAddress();
  console.log(`✅ USDCStreamDCA deployed to: ${usdcStreamDCAAddress}`);
  
  // Wait for network to catch up
  console.log("   Waiting for confirmation...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Deploy PortfolioTracker
  console.log("\n📦 Step 3: Deploying PortfolioTracker...");
  const PortfolioTracker = await hre.ethers.getContractFactory("PortfolioTracker");
  const portfolioTracker = await PortfolioTracker.deploy();
  await portfolioTracker.waitForDeployment();
  const portfolioTrackerAddress = await portfolioTracker.getAddress();
  console.log(`✅ PortfolioTracker deployed to: ${portfolioTrackerAddress}`);
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("==================================");
  console.log(`MockUSDC: ${mockUSDCAddress}`);
  console.log(`USDCStreamDCA: ${usdcStreamDCAAddress}`);
  console.log(`PortfolioTracker: ${portfolioTrackerAddress}`);
  console.log("\n📊 Next steps:");
  console.log("1. Update README with deployed addresses");
  console.log("2. Create test stream via OpenClaw skill");
  console.log("3. Share on Moltbook with live contract links");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});