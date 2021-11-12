const { constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const SafeOwnable = artifacts.require('SafeOwnableMock');

contract('SafeOwnable', function (accounts) {
  const [ owner, other, onemore ] = accounts;

  beforeEach(async function () {
    this.safeOwnable = await SafeOwnable.new({ from: owner });
  });

  it('has an owner', async function () {
    expect(await this.safeOwnable.owner()).to.equal(owner);
  });

  describe('transfer ownership', function () {
    it('retains owner after transfer initiation', async function () {
      await this.safeOwnable.beginTransferOwnership(other, { from: owner });

      expect(await this.safeOwnable.owner()).to.equal(owner);
    });

    it('changes owner after transfer approval', async function () {
      await this.safeOwnable.beginTransferOwnership(other, { from: owner });

      expect(await this.safeOwnable.owner()).to.equal(owner);

      const receipt = await this.safeOwnable.acceptTransferOwnership({ from: other });
      expectEvent(receipt, 'OwnershipTransferred');

      expect(await this.safeOwnable.owner()).to.equal(other);
    });

    it('prevents others from accepting ownership transfer', async function () {
      await this.safeOwnable.beginTransferOwnership(other, { from: owner });

      await expectRevert(
        this.safeOwnable.acceptTransferOwnership({ from: onemore }),
        'SafeOwnable: caller is not the new owner',
      );
    });

    it('prevents non-owners from transferring', async function () {
      await expectRevert(
        this.safeOwnable.beginTransferOwnership(other, { from: other }),
        'SafeOwnable: caller is not the owner',
      );
    });

    it('guards ownership against stuck state', async function () {
      await expectRevert(
        this.safeOwnable.beginTransferOwnership(ZERO_ADDRESS, { from: owner }),
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
