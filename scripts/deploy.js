const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CoinFlip contract to", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Деплоим контракт
  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy();

  await coinFlip.waitForDeployment();

  const contractAddress = await coinFlip.getAddress();
  console.log("✅ CoinFlip deployed to:", contractAddress);
  
  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to your .env file as NEXT_PUBLIC_CONTRACT_ADDRESS");
  console.log("3. Run 'npm run dev' to start the frontend");
  
  // Верификация на Basescan (если есть API ключ)
  if (hre.network.name === "baseSepolia" && process.env.BASESCAN_API_KEY) {
    console.log("\n🔍 Waiting for block confirmations...");
    await coinFlip.deploymentTransaction().wait(5);
    
    console.log("📝 Verifying contract on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Basescan!");
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
