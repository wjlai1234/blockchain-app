// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CAYTOKEN.sol";
import "./KENTOKEN.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    CAYTOKEN public cayToken;
    KENTOKEN public kenToken;
    uint public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(CAYTOKEN _cayToken,KENTOKEN _kenToken){
        cayToken = _cayToken;
        kenToken = _kenToken;
    }


    function buyCAYTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require that EthSwap has enough tokens
        require(cayToken.balanceOf(address(this)) >= tokenAmount);

        // Transfer tokens to the user
        cayToken.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(cayToken), tokenAmount, rate);
    }

    function sellCAYTokens(uint _amount) public payable{
        // User can't sell more tokens than they have
        require(cayToken.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // Perform sale
        cayToken.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(cayToken), _amount, rate);
    }



    function sellKENTokens(uint _amount) public payable{
        // User can't sell more tokens than they have
        require(kenToken.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // Perform sale
        kenToken.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(kenToken), _amount, rate);
    }

    function buyKENTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require that EthSwap has enough tokens
        require(kenToken.balanceOf(address(this)) >= tokenAmount);

        // Transfer tokens to the user
        kenToken.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(kenToken), tokenAmount, rate);
    }


}
