//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20TokenOZ is ERC20 {

    uint8 private token_decimals;

    constructor(string memory _name, string memory _symbol, uint256 _decimals, uint256 _totalSupply) 
        ERC20(_name, _symbol) {
        token_decimals = uint8(_decimals);
        _mint(msg.sender, _totalSupply / 10);
    }

    function decimals() public view override returns (uint8) {
        return uint8(token_decimals);
    }

    // 水龙头函数
    // uint256 public FAUCET_AMOUNT = 100 * 10**token_decimals; 
    function faucet() public {
        uint256 _faucet_amount = 100 * 10**token_decimals;   // 分发100代币，考虑小数点
        // require(balanceOf(address(this)) >= FAUCET_AMOUNT, "Insufficient faucet funds");
        // transfer(address(msg.sender), FAUCET_AMOUNT);
        _mint(msg.sender, _faucet_amount);
    }
}