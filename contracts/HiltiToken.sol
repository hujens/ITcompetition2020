pragma solidity ^0.5.0;

import "../client/node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract HiltiToken is ERC20 {

  // Definition of token details
  string public name = "HiltiToken";
  string public symbol = "HILTI";
  uint8 public decimals = 0;
  uint public INITIAL_SUPPLY = 0;

  // Mint all tokens with the total supply and give it to the contract deployer
  constructor() public {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

}