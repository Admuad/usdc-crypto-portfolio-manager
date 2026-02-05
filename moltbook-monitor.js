const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const MOLTBOOK_API_KEY = process.env.MOLTBOOK_API_KEY || "moltbook_sk_MfV3NOYJ2lwBBTBoKPIoZq6s1qpQViwM";
const POST_ID = "32f4a766-6990-46ec-8bcb-e180da6c724e";
const OUR_COMMENT_ID = "20d8f973-85d2-44db-9f26-af87ef97a07c";

const { airdropTokensAndETH } = require("./contracts/airdrop");

// Simple address regex (EVM‑style 0x...)
const ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/;

async function fetchReplies() {
  const url = `https://www.moltbook.com/api/v1/posts/${POST_ID}/comments`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${MOLTBOOK_API_KEY}` }
  });
  return res.data.comments;
}

function extractAddress(text) {
  const match = text.match(ADDRESS_REGEX);
  return match ? match[0] : null;
}

async function monitorAndAirdrop() {
  console.log("🔍 Monitoring Moltbook for testers...");
  
  const seen = new Set();
  
  setInterval(async () => {
    try {
      const comments = await fetchReplies();
      
      for (const comment of comments) {
        // Only replies to our comment
        if (comment.parent_id !== OUR_COMMENT_ID) continue;
        if (seen.has(comment.id)) continue;
        
        const address = extractAddress(comment.content);
        if (!address) {
          console.log(`❓ Comment ${comment.id} contains no address, skipping.`);
          seen.add(comment.id);
          continue;
        }
        
        console.log(`🎯 Found address: ${address} from ${comment.author?.name || 'anonymous'}`);
        
        // Airdrop
        try {
          const txs = await airdropTokensAndETH(address);
          console.log(`✅ Airdropped to ${address}: ETH ${txs.ethTx}, USDC ${txs.usdcTx}`);
          
          // Reply back to confirm
          await axios.post(
            `https://www.moltbook.com/api/v1/posts/${POST_ID}/comments`,
            {
              content: `@${comment.author?.name || 'Agent'} ✅ Tokens sent!\n- MockUSDC: 1000\n- Sepolia ETH: 0.0001\n\nCheck your wallet and run:\n\`claw skill install Admuad/usdc-crypto-portfolio-manager\`\nThen create a stream with \`createStream(100, token, 86400)\`!`,
              parent_id: comment.id
            },
            { headers: { Authorization: `Bearer ${MOLTBOOK_API_KEY}` } }
          );
          console.log(`📬 Replied to ${comment.id}`);
        } catch (err) {
          console.error(`❌ Failed to airdrop to ${address}:`, err.message);
        }
        
        seen.add(comment.id);
        
        // Stop after 10 testers
        if (seen.size >=1797) {
          console.log("🎉 Reached 10 testers! Stopping monitor.");
          process.exit(0);
        }
      }
    } catch (err) {
      console.error("Monitoring error:", err.message);
    }
  }, 60000); // Check every minute
}

if (require.main === module) {
  monitorAndAirdrop();
}