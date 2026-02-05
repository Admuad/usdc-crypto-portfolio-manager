import { ethers } from "ethers";

async function main() {
  // Generate a new wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log("🔥 NEW DEPLOYMENT WALLET GENERATED");
  console.log("===================================");
  console.log(`Address: ${wallet.address}`);
  console.log(`Private Key: ${wallet.privateKey}`);
  console.log(`Mnemonic: ${wallet.mnemonic?.phrase || "N/A"}`);
  console.log("\n📋 SEPOLIA FAUCETS:");
  console.log("1. https://sepoliafaucet.com");
  console.log("2. https://faucet.quicknode.com/ethereum/sepolia");
  console.log("3. https://www.infura.io/faucet/sepolia");
  console.log("\n💰 Send 0.1-0.5 Sepolia ETH to address above");
  
  // Save securely (not committing to git)
  const fs = require("fs");
  fs.writeFileSync(".deployment-wallet.json", JSON.stringify({
    address: wallet.address,
    privateKey: wallet.privateKey,
    createdAt: new Date().toISOString(),
    purpose: "USDC Portfolio Manager Hackathon Deployment"
  }, null, 2));
  
  console.log("\n🔐 Wallet saved to .deployment-wallet.json");
  console.log("⚠️  WARNING: Keep this file SECURE. Delete after deployment.");
}

main().catch(console.error);
EOF && node generate-wallet.js
