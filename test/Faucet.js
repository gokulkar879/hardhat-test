const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');


describe("Faucet", function () {
  async function deployContractAndSetVariable() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();
    const provider = await ethers.getDefaultProvider();
    const [owner, address1] = await ethers.getSigners();
    const deployed_address = faucet.address;
    // console.log("signer address", owner)
    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    return {faucet, owner, address1, withdrawAmount, deployed_address, provider};

  }

  it('should deploy contract properly', async function () {
    const {faucet, owner} = await loadFixture(deployContractAndSetVariable)

    expect(await faucet.owner()).to.equal(owner.address)
  })

  // it('should not be able to send ether', async function () {
  //    const {faucet, owner, address1} = await loadFixture(deployContractAndSetVariable)
  //    let amnt = ethers.utils.parseUnits("1", "ether");
  //   //  let val = await faucet.connect(address1);
  //    expect(await faucet.withdraw(amnt)).to.be.reverted;
  // })

  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, address1 } = await loadFixture(
      deployContractAndSetVariable
    );

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await expect(faucet.connect(address1).withdraw(withdrawAmount)).to.be.revertedWith("Failed to send ether");
  });
  it('should not allow withdrawall', async function () {
    const { faucet, address1 } = await loadFixture(
      deployContractAndSetVariable
    );

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await expect(faucet.connect(address1).withdrawAll()).to.be.reverted;
  });
  it('should  allow withdrawall', async function () {
    const { faucet, owner, address1 } = await loadFixture(
      deployContractAndSetVariable
    );

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await expect(faucet.withdrawAll()).not.to.be.reverted;
  });
  it(' should not destroy faucet', async function () {
    const { faucet, address1 } = await loadFixture(
      deployContractAndSetVariable
    );

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await expect(faucet.connect(address1).destroyFaucet()).to.be.reverted;
  });
  it(' should destroy', async function () {
    const { faucet, owner, address1, deployed_address, provider } = await loadFixture(
      deployContractAndSetVariable
    );

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');
    await faucet.destroyFaucet();
    // console.log(await provider.getCode(deployed_address));
    expect(await provider.getCode(deployed_address)).to.equal("0x");
  });
})