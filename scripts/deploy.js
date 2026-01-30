const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CoinFlip contract to", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy();

  await coinFlip.waitForDeployment();

  const contractAddress = await coinFlip.getAddress();
  console.log("✅ CoinFlip deployed to:", contractAddress);
  
  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address above");
  
  if (hre.network.name === "baseMainnet") {
    console.log("2. Update CONTRACT_ADDRESSES in src/config/contract.ts");
    console.log("3. Run 'vercel --prod' to deploy the frontend");
  } else {
    console.log("2. Add it to your .env file as NEXT_PUBLIC_CONTRACT_ADDRESS");
    console.log("3. Run 'npm run dev' to start the frontend");
  }
  
  // Verify on Basescan (for both mainnet and sepolia)
  const shouldVerify = 
    (hre.network.name === "baseMainnet" || hre.network.name === "baseSepolia") && 
    process.env.BASESCAN_API_KEY;

  if (shouldVerify) {
    console.log("\n🔍 Waiting for block confirmations...");
    await coinFlip.deploymentTransaction().wait(5);
    
    console.log("📝 Verifying contract on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Basescan!");
      
      const explorerUrl = hre.network.name === "baseMainnet"
        ? `https://basescan.org/address/${contractAddress}`
        : `https://sepolia.basescan.org/address/${contractAddress}`;
      console.log("🔗 View on explorer:", explorerUrl);
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
