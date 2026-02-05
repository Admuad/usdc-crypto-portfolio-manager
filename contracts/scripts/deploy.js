const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying USDC Portfolio Manager Contracts...");
  
  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  // Deploy PortfolioTracker
  console.log("\n📊 Deploying PortfolioTracker...");
  const PortfolioTracker = await hre.ethers.getContractFactory("PortfolioTracker");
  const portfolioTracker = await PortfolioTracker.deploy();
  await portfolioTracker.waitForDeployment();
  const portfolioTrackerAddress = await portfolioTracker.getAddress();
  console.log(`PortfolioTracker deployed to: ${portfolioTrackerAddress}`);
  
  // Deploy USDCStreamDCA (mock DEX aggregator address for demo)
  console.log("\n💰 Deploying USDCStreamDCA...");
  const USDCStreamDCA = await hre.ethers.getContractFactory("USDCStreamDCA");
  const mockDexAggregator = deployer.address; // In production: real DEX aggregator
  const usdcStreamDCA = await USDCStreamDCA.deploy(mockDexAggregator);
  await usdcStreamDCA.waitForDeployment();
  const usdcStreamDCAAddress = await usdcStreamDCA.getAddress();
  console.log(`USDCStreamDCA deployed to: ${usdcStreamDCAAddress}`);
  
  // Update prices for demo
  console.log("\n🎯 Setting up demo prices...");
  await portfolioTracker.updatePrices(
    hre.ethers.parseUnits("3000", 6), // $3000 ETH in USDC decimals
    hre.ethers.parseUnits("0.75", 6)  // $0.75 MATIC in USDC decimals
  );
  console.log("Demo prices set: ETH=$3000, MATIC=$0.75");
  
  // Create demo portfolio
  console.log("\n📈 Creating demo portfolio...");
  await portfolioTracker.updateChainBalance(
    1, // Ethereum
    hre.ethers.parseEther("2.1"), // 2.1 ETH
    hre.ethers.parseUnits("5000", 6) // 5000 USDC
  );
  
  await portfolioTracker.updateChainBalance(
    8453, // Base
    hre.ethers.parseEther("0.8"), // 0.8 ETH
    hre.ethers.parseUnits("3000", 6) // 3000 USDC
  );
  
  await portfolioTracker.updateChainBalance(
    137, // Polygon
    hre.ethers.parseEther("5000"), // 5000 MATIC
    hre.ethers.parseUnits("2000", 6) // 2000 USDC
  );
  
  // Get portfolio stats
  const [totalValue, lastUpdated, chainCount] = await portfolioTracker.getPortfolio(deployer.address);
  const riskScore = await portfolioTracker.calculateRiskScore(deployer.address);
  
  console.log("\n✅ Deployment Complete!");
  console.log("========================");
  console.log(`PortfolioTracker: ${portfolioTrackerAddress}`);
  console.log(`USDCStreamDCA: ${usdcStreamDCAAddress}`);
  console.log(`Demo Portfolio Value: $${hre.ethers.formatUnits(totalValue, 6)} USDC`);
  console.log(`Chain Count: ${chainCount}`);
  console.log(`Risk Score: ${riskScore}/100`);
  console.log("\n🔗 Verification Commands:");
  console.log(`npx hardhat verify --network sepolia ${portfolioTrackerAddress}`);
  console.log(`npx hardhat verify --network sepolia ${usdcStreamDCAAddress} "${mockDexAggregator}"`);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      portfolioTracker: portfolioTrackerAddress,
      usdcStreamDCA: usdcStreamDCAAddress
    },
    demoPortfolio: {
      totalValueUSD: hre.ethers.formatUnits(totalValue, 6),
      chainCount: chainCount.toString(),
      riskScore: riskScore.toString()
    }
  };
  
  const fs = require("fs");
  fs.writeFileSync(
    `deployments/${hre.network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📁 Deployment info saved to deployments/ directory");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });