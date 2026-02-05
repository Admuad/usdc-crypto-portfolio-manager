import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("USDCStreamDCA", function () {
  let usdcStreamDCA;
  let mockUSDC;
  let mockToken;
  let deployer;
  let user;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    // Deploy mock USDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy mock target token (e.g., WETH)
    const MockToken = await ethers.getContractFactory("MockUSDC");
    mockToken = await MockToken.deploy();
    await mockToken.waitForDeployment();

    // Deploy USDCStreamDCA
    const USDCStreamDCA = await ethers.getContractFactory("USDCStreamDCA");
    usdcStreamDCA = await USDCStreamDCA.deploy(await mockUSDC.getAddress(), deployer.address);
    await usdcStreamDCA.waitForDeployment();

    // Give user some USDC and approve
    await mockUSDC.mint(user.address, ethers.parseUnits("1000", 6));
    await mockUSDC.connect(user).approve(await usdcStreamDCA.getAddress(), ethers.MaxUint256);
  });

  it("Should create a stream correctly", async function () {
    const usdcPerDay = ethers.parseUnits("100", 6);
    await usdcStreamDCA.connect(user).createStream(await mockToken.getAddress(), usdcPerDay);
    
    const stream = await usdcStreamDCA.streams(0);
    expect(stream.user).to.equal(user.address);
    expect(stream.active).to.be.true;
    // 100 USDC / 86400 seconds = ~1157407 wei per second (with 6 decimals)
    expect(stream.usdcPerSecond).to.equal(BigInt(Math.floor(Number(usdcPerDay) / 86400)));
  });

  it("Should execute a stream after time passes", async function () {
    const usdcPerDay = ethers.parseUnits("86400", 6); // 1 USDC per second for easy math
    await usdcStreamDCA.connect(user).createStream(await mockToken.getAddress(), usdcPerDay);
    
    // Fast forward 10 seconds
    await ethers.provider.send("evm_increaseTime", [10]);
    await ethers.provider.send("evm_mine");
    
    const initialBalance = await mockUSDC.balanceOf(user.address);
    await usdcStreamDCA.executeStream(0);
    const finalBalance = await mockUSDC.balanceOf(user.address);
    
    // Should have spent roughly 10-11 USDC (depending on block timestamp)
    const spent = initialBalance - finalBalance;
    expect(spent).to.be.closeTo(ethers.parseUnits("10", 6), ethers.parseUnits("2", 6));
  });
});
