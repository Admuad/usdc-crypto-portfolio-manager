const { ethers } = require("hardhat");
require("dotenv").config();

const MOCK_USDC_ADDRESS = "0x6aB589D1D6A72060877EFA772CAcCCD8bAE09CEc";
const MOCK_USDC_ABI = [
  "function mint(address to, uint256 amount) external",
  "function decimals() external view returns (uint8)"
];

async function airdropTokensAndETH(recipientAddress) {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const mockUSDC = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, wallet);
  
  const amountTokens = ethers.parseUnits("1000", 6); // 1000 MockUSDC (6 decimals)
  const amountETH = ethers.parseEther("0.0001"); // gas for ~5-10 txns
  
  console.log(`🎁 Airdropping to ${recipientAddress}`);
  
  // 1. Send ETH for gas
  const ethTx = await wallet.sendTransaction({
    to: recipientAddress,
    value: amountETH
  });
  console.log(`✅ Sent ${ethers.formatEther(amountETH)} ETH: ${ethTx.hash}`);
  
  // 2. Mint MockUSDC
  const mintTx = await mockUSDC.mint(recipientAddress, amountTokens);
  console.log(`✅ Minted ${ethers.formatUnits(amountTokens, 6)} MockUSDC: ${mintTx.hash}`);
  
  return { ethTx: ethTx.hash, usdcTx: mintTx.hash };
}

// If called directly via node airdrop.js <address>
if (require.main === module) {
  const address = process.argv[2];
  if (!ethers.isAddress(address)) {
    console.error("❌ Invalid Ethereum address");
    process.exit(1);
  }
  airdropTokensAndETH(address).catch(console.error);
}

module.exports = { airdropTokensAndETH };