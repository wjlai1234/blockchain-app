// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./CAYTOKEN.sol";
import "./KENTOKEN.sol";
import "hardhat/console.sol";

contract AMM {

    //1000000000000000000
    uint256 public totalCAYTokenInPool;//total amount of CAY token in the pool
    uint256 public totalKENTokenInPool;//total amount of KEN token in the pool
    uint256 K;//K constant in X*Y = K
    uint256 totalShares;
    
    uint constant PRECISION = 1_000_000;

    CAYTOKEN public cayToken;
    KENTOKEN public kenToken;

    mapping(address => uint256) public lpShares;
    
    event PoolAreCreated(
    address account,
    address cayToken,
    uint cayAmount,
    address kenToken,
    uint kenAmount
  );

    constructor(CAYTOKEN _cayToken,KENTOKEN _kenToken){
    cayToken = _cayToken;
    kenToken = _kenToken;
  }

    //no liquidity, cannot withdraw from liquidity pool
    modifier activePool() {
        require(totalCAYTokenInPool > 0 && totalKENTokenInPool > 0, "Empty pool, please add liquidity.");
        _;
    }

    //get the liquidity pool total Eth token, TkB token
    function checkBothTokenAmountInPool() public view returns(uint256, uint256) {
        return (totalCAYTokenInPool,totalKENTokenInPool);
    }


    //get LP balance token in the pool
    function getLPTotalCAY() public view returns (uint256 _lpCAYBalance) {
        _lpCAYBalance = lpShares[msg.sender] * totalCAYTokenInPool / totalShares;
    }

    function getLPTotalKEN() public view returns (uint256 _lpKENBalance) {
        _lpKENBalance = lpShares[msg.sender] * totalKENTokenInPool / totalShares;
    }

    //to get the total Tkb token needed to add into pool
    function getAddPoolCAYRequirement(uint256 _kenToken) public view activePool returns(uint256 reqCAYToken) {
        reqCAYToken = _kenToken * totalCAYTokenInPool / totalKENTokenInPool ;
    }

    //to get the total eth token needed to add into pool
    function getAddPoolKENRequirement(uint256 _cayToken) public view activePool returns(uint256 reqKENToken) {
        reqKENToken = _cayToken * totalKENTokenInPool / totalCAYTokenInPool ;
    }


    //add liquidity into the pool, set K constant if first added, store share % into user
    function createPool(
        uint256 addCAYTokenInPool, 
        uint256 addKENTokenInPool
        ) payable public {
        require(addCAYTokenInPool > 0 || addKENTokenInPool > 0, "Need more than Zero value");
        uint256 share;
        if(totalCAYTokenInPool == 0 && totalKENTokenInPool == 0)  // Genesis liquidity is issued 100 Shares
        {
            totalCAYTokenInPool = addCAYTokenInPool;
            totalKENTokenInPool = addKENTokenInPool;
            K = totalCAYTokenInPool * totalKENTokenInPool;
            share = 100 * PRECISION; //100_000_000
        }
        else
        {
            totalCAYTokenInPool += addCAYTokenInPool;
            totalKENTokenInPool += addKENTokenInPool;
            uint256 share1 = totalShares * addCAYTokenInPool / totalCAYTokenInPool;
            uint256 share2 = totalShares * addKENTokenInPool / totalKENTokenInPool;
            require(share1 == share2, "Equivalent value of tokens not provided...");
            share = share1;
        }
    
        // Require that User has enough CAY tokens
        // Require that User has enough KEN tokens
        require(cayToken.balanceOf(msg.sender) >= addCAYTokenInPool,"CAY Token Not Enough!");
        require(kenToken.balanceOf(msg.sender) >= addKENTokenInPool,"KEN Token Not Enough!");
  
        cayToken.transferFrom(msg.sender, address(this), addCAYTokenInPool);
        kenToken.transferFrom(msg.sender, address(this), addKENTokenInPool);

        totalShares += share;
        lpShares[msg.sender] += share;
      
        emit PoolAreCreated(msg.sender, address(cayToken), addCAYTokenInPool, address(kenToken),addKENTokenInPool);
    }

    //get LP withdraw tokens based on percentage
    function getWithdrawToken (uint256 _share) public view activePool returns(uint256 withdrawCAY, uint256 withdrawKEN) {
        uint256 amountCAY;
        uint256 amountKEN;
        
        amountCAY = getLPTotalCAY();
        amountKEN = getLPTotalKEN();
        withdrawCAY = amountCAY * _share / 100;
        withdrawKEN = amountKEN * _share / 100;
    }

    //withdraw  tokens from pool and add the tokens back to user
    function withdraw(uint256 _share) external activePool returns(uint256 _withdrawCAY, uint256 _withdrawKEN) {
        require(_share > 0,"cannot be zero value");
        (_withdrawCAY, _withdrawKEN) = getWithdrawToken(_share);
        
        totalCAYTokenInPool -= _withdrawCAY;
        totalKENTokenInPool -= _withdrawKEN;
        K = totalCAYTokenInPool * totalKENTokenInPool;

        kenToken.approve(address(this), _withdrawKEN);
        cayToken.approve(address(this), _withdrawCAY);
        kenToken.transferFrom( address(this),msg.sender, _withdrawKEN);
        cayToken.transferFrom( address(this),msg.sender, _withdrawCAY);

        lpShares[msg.sender] -= _share;
        totalShares -= _share;
    }

    // Returns the amount of TkB token that the user will get when swapping a exact amount of Eth token
    function getExactCAYforKEN(uint256 _amountCAY) public view activePool returns(uint256 amountKEN) {
        amountKEN = getAmountOut(_amountCAY, totalCAYTokenInPool, totalKENTokenInPool);

        // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
        if(amountKEN >= totalKENTokenInPool) amountKEN = totalKENTokenInPool - 1;
    }
    
    // Returns the amount of Eth token needed to swap a exact amount of TkB token
    function getCAYforExactKEN(uint256 _amountKEN) public view activePool returns(uint256 amountCAY) {
        require(_amountKEN < totalKENTokenInPool, "Insufficient pool balance");
        amountCAY = getAmountIn(_amountKEN, totalCAYTokenInPool, totalKENTokenInPool);
    }

    // Swaps Eth token to TkB token using algorithmic price determination
    function swapCAYforKEN( uint256 _amountCAY) external activePool returns(uint256 amountKEN) {
        require(_amountCAY > 0, "amount can't be 0");
        amountKEN = getExactCAYforKEN(_amountCAY);

        totalCAYTokenInPool += _amountCAY;
        totalKENTokenInPool -= amountKEN;

        K = totalCAYTokenInPool * totalKENTokenInPool;

        cayToken.transferFrom(msg.sender, address(this), _amountCAY);
        kenToken.approve( address(this), amountKEN);
        kenToken.transferFrom( address(this),msg.sender, amountKEN);
    }

    // Returns the amount of Eth token that the user will get when swapping a exact amount of Tkb token
    function getExactKENforCAY (uint256 _amountKEN) public view activePool returns(uint256 amountCAY) {
        amountCAY = getAmountOut(_amountKEN, totalKENTokenInPool, totalCAYTokenInPool);

        // To ensure that Token1's pool is not completely depleted leading to inf:0 ratio
        if(amountCAY >= totalCAYTokenInPool) amountCAY = totalCAYTokenInPool - 1;
    }
    
    // Returns the amount of Tkb token needed to swap a exact amount of Eth token
    function getKENforExactCAY (uint256 _amountCAY) public view activePool returns(uint256 amountKEN) {
        require(_amountCAY < totalCAYTokenInPool, "Insufficient pool balance");
        amountKEN = getAmountIn(_amountCAY, totalKENTokenInPool, totalCAYTokenInPool);
    }

    // Swaps KEN token to CAY token using algorithmic price determination
    function swapKENforCAY(uint256 _amountKEN) external activePool returns(uint256 amountCAY) {
        require(_amountKEN > 0, "amount can't be 0");
        amountCAY = getExactKENforCAY(_amountKEN);

        totalKENTokenInPool += _amountKEN;
        totalCAYTokenInPool -= amountCAY;
        K = totalCAYTokenInPool * totalKENTokenInPool;
        kenToken.transferFrom(msg.sender, address(this), _amountKEN);

        cayToken.approve( address(this), amountCAY);
        cayToken.transferFrom( address(this),msg.sender, amountCAY);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn * 997;
        uint numerator = amountInWithFee * (reserveOut);
        uint denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {
        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        uint numerator = reserveIn * amountOut * 1000;
        uint denominator = (reserveOut - amountOut) * 997;
        amountIn = (numerator / denominator) + 1;
    }

}