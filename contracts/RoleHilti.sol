pragma solidity ^0.5.0;

// Import 'Roles' from OpenZeppelin:
import "../client/node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'HiltiRole' to manage this role - add, remove, check
contract HiltiRole {
  using Roles for Roles.Role;

  // Events, one for Adding, and other for Removing
  event HiltiAdded(address indexed account);
  event HiltiRemoved(address indexed account);

  // Defining a struct 'hilti' by inheriting from 'Roles' library, struct Role
  Roles.Role private hilti_accounts;

  // In the constructor make the address that deploys this contract the 1st Hilti Account
  constructor() public {
    _addHilti(msg.sender);
  }

  // Defining a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyHilti() {
    require(isHilti(msg.sender), "sender is not a Hilti account");
    _;
  }

  // Define a function 'isHilti' to check this role
  function isHilti(address account) public view returns (bool) {
    return hilti_accounts.has(account);
  }

  // Define a function 'addHilti' that adds this role --> in HiltiContract because it need onlyHilti modifier!
  /*function addHilti(address account) public {
    _addHilti(account);
  }*/

  // Define a function 'renounceHilti' to renounce this role
  function renouncHilti() public {
    _removeHilti(msg.sender);
  }

  // Define an internal function '_addHilti' to add this role, called by 'addHilti'
  function _addHilti(address account) internal {
    hilti_accounts.add(account);
    emit HiltiAdded(account);
  }

  // Define an internal function '_removeHilti' to remove this role, called by 'removeHilti'
  function _removeHilti(address account) internal {
    hilti_accounts.remove(account);
    emit HiltiRemoved(account);
  }
}