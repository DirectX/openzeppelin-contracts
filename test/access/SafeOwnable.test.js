const { constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const SafeOwnable = artifacts.require('SafeOwnableMock');

contract('SafeOwnable', function (accounts) {
  const [ owner, other ] = accounts;

  beforeEach(async function () {
    this.safeOwnable = await SafeOwnable.new({ from: owner });
  });

  it('has an owner', async function () {
    expect(await this.safeOwnable.owner()).to.equal(owner);
  });

  describe('transfer ownership', function () {
    it('changes owner after transfer', async function () {
      const receipt = await this.safeOwnable.transferOwnership(other, { from: owner });
      expectEvent(receipt, 'OwnershipTransferred');

      expect(await this.safeOwnable.owner()).to.equal(other);
    });

    it('prevents non-owners from transferring', async function () {
      await expectRevert(
        this.safeOwnable.transferOwnership(other, { from: other }),
        'SafeOwnable: caller is not the owner',
      );
    });

    it('guards ownership against stuck state', async function () {
      await expectRevert(
        this.safeOwnable.transferOwnership(ZERO_ADDRESS, { from: owner }),
        'SafeOwnable: new owner is the zero address',
      );
    });
  });

  describe('renounce ownership', function () {
    it('loses owner after renouncement', async function () {
      const receipt = await this.safeOwnable.renounceOwnership({ from: owner });
      expectEvent(receipt, 'OwnershipTransferred');

      expect(await this.safeOwnable.owner()).to.equal(ZERO_ADDRESS);
    });

    it('prevents non-owners from renouncement', async function () {
      await expectRevert(
        this.safeOwnable.renounceOwnership({ from: other }),
        'SafeOwnable: caller is not the owner',
      );
    });
  });
});
