async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  console.log("MockUSDC deployed to:", await mockUSDC.getAddress());

  // Deploy USDCStreamDCA with MockUSDC address
  const USDCStreamDCA = await ethers.getContractFactory("USDCStreamDCA");
  const usdcStreamDCA = await USDCStreamDCA.deploy(await mockUSDC.getAddress());
  await usdcStreamDCA.waitForDeployment();
  console.log("USDCStreamDCA deployed to:", await usdcStreamDCA.getAddress());

  // Deploy PortfolioTracker
  const PortfolioTracker = await ethers.getContractFactory("PortfolioTracker");
  const portfolioTracker = await PortfolioTracker.deploy();
  await portfolioTracker.waitForDeployment();
  console.log("PortfolioTracker deployed to:", await portfolioTracker.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
