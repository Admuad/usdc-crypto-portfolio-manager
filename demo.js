// Demo script for USDC Portfolio Manager
const manager = require('./index.js');

async function runDemo() {
  console.log("🚀 Initializing USDC Portfolio Manager...");
  
  // Mock config
  const config = {
    ethereumRpc: "https://ethereum.publicnode.com",
    baseRpc: "https://mainnet.base.org",
    defaultWallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  };

  const skill = manager;
  
  console.log("\n📊 Checking Portfolio Balance...");
  const balance = await skill.commands.balance.handler([config.defaultWallet], { config });
  console.log(JSON.stringify(balance, null, 2));

  console.log("\n⚠️ Running Risk Analysis...");
  const risk = await skill.commands.risk.handler([config.defaultWallet], { config });
  console.log(JSON.stringify(risk, null, 2));

  console.log("\n📈 Setting up DCA Strategy...");
  const dca = await skill.commands.dca.handler(['ETH', '100', '7'], { config });
  console.log(JSON.stringify(dca, null, 2));

  console.log("\n✅ Demo Complete!");
}

runDemo().catch(console.error);
