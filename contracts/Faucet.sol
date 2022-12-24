// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract Faucet {
   address payable public owner;

   constructor() {
    owner = payable(msg.sender);
   }

   function  withdraw(uint val) external {
       require(val <= 1100000000000000000);
       (bool sent, ) = payable(msg.sender).call{value: val}("");
       require(sent, "Failed to send ether");
   }

   function withdrawAll() external onlyOwner{
      (bool sent, ) = owner.call{value: address(this).balance}("");
      require(sent, "Failed to send ether");
   }

    function destroyFaucet() external onlyOwner {
        selfdestruct(owner);
    } 

   modifier onlyOwner() {
      require(msg.sender == owner);
      _;
   }
}
