// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (access/SafeOwnable.sol)

pragma solidity ^0.8.0;

import "../utils/Context.sol";

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract SafeOwnable is Context {
    address private _owner;
    address private _newOwner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "SafeOwnable: caller is not the owner");
        _;
    }

    /**
     * @dev Throws if called by any account other than the new owner.
     */
    modifier onlyNewOwner() {
        require(_newOwner == _msgSender(), "SafeOwnable: caller is not the new owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Initiates transfer ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function beginTransferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "SafeOwnable: new owner is the zero address");
        _newOwner = newOwner;
    }

    /**
     * @dev Approves ownership transfer of the contract to a new account (`newOwner`).
     * Can only be called by the newly assigned owner.
     */
    function acceptTransferOwnership() public virtual onlyNewOwner {
        _transferOwnership(_newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
