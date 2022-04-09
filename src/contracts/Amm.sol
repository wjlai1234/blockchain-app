// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Token.sol";

contract AMM {
    
    uint256 totalEthToken;//total amount of Eth token in the pool
    uint256 totalTkbToken;//total amount of TkB token in the pool
    uint256 K;//K constant in X*Y = K
    
    uint constant PRECISION = 1_000_000;

    mapping(address => uint256) share;
    mapping(address => uint256) balanceEth;
    mapping(address => uint256) balanceTkb;
    
    //no liquidity, cannot withdraw from liquidity pool
    modifier activePool() {
        require(totalEthToken > 0 && totalTkbToken > 0, "Empty pool, please add liquidity.");
        _;
    }

    //get the liquidity pool total Eth token, TkB token
    function getPoolInfo() external view returns(uint256, uint256) {
        return (totalEthToken, totalTkbToken);
    }

    //get user balance token in the pool
    function getUserPoolBalance() external view returns (uint256 amountEth, uint amountTkb) {
        amountEth = balanceEth[msg.sender];
        amountTkb = balanceTkb[msg.sender];
    }

    //to get the total Tkb token needed to add into pool
    function getAddPoolTkbRequirement(uint256 ethToken) public view activePool returns(uint256 reqTkbToken) {
        reqTkbToken = ethToken / totalEthToken * totalTkbToken ;
    }

    //to get the total eth token needed to add into pool
    function getAddPoolEthRequirement(uint256 tkbToken) public view activePool returns(uint256 reqEthToken) {
        reqEthToken = tkbToken / totalTkbToken * totalEthToken ;
    }


    //add liquidity into the pool, set K constant if first added, store share % into user
    function addLiquidity(
        address tokenB,
        uint256 addEthToken, 
        uint256 addTkbToken
        //address to
        ) external {
        require(addEthToken > 0 && addTkbToken > 0, "Need more than Zero value");
        if(totalEthToken == 0 && totalTkbToken == 0)  // Genesis liquidity is issued 100 Shares
        {
            totalEthToken = addEthToken;
            totalTkbToken = addTkbToken;
            K = totalEthToken * totalTkbToken;
        }
        else
        {
            totalEthToken += addEthToken;
            totalTkbToken += addTkbToken;
        }

        balanceEth[msg.sender] += addEthToken;
        balanceTkb[msg.sender] += addTkbToken;

        transferETH(address(this), addEthToken);
        Token(tokenB).transferFrom(msg.sender, address(this), addTkbToken);
    }

    //get withdraw total tokens
    function getWithdrawToken () external view activePool returns(uint256 withdrawEth, uint256 withdrawTkb) {
        withdrawEth = balanceEth[msg.sender];
        withdrawTkb = balanceTkb[msg.sender];
    }

    //withdraw  tokens from pool and add the tokens back to user
    function withdraw(uint256 _share) external activePool returns(uint256 withdrawEth, uint256 withdrawTkb) {
        require(_share > 0,"cannot be zero value");
        withdrawEth = balanceEth[msg.sender] * _share / 100;
        withdrawTkb = balanceTkb[msg.sender] * _share / 100;

        totalEthToken -= withdrawEth;
        totalTkbToken -= withdrawTkb;
        K = totalEthToken * totalTkbToken;

        balanceEth[msg.sender] -= withdrawEth;
        balanceTkb[msg.sender] -= withdrawTkb;
    }

    // Returns the amount of TkB token that the user will get when swapping a exact amount of Eth token
    function getExactEthforTkB(uint256 _amountEth) public view activePool returns(uint256 amountTkb) {
        amountTkb = getAmountOut(_amountEth, totalEthToken, totalTkbToken);

        // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
        if(amountTkb >= totalTkbToken) amountTkb = totalTkbToken - 1;
    }
    
    // Returns the amount of Eth token needed to swap a exact amount of TkB token
    function getEthforExactTkB(uint256 _amountTkB) public view activePool returns(uint256 amountEth) {
        require(_amountTkB < totalTkbToken, "Insufficient pool balance");
        amountEth = getAmountIn(_amountTkB, totalEthToken, totalTkbToken);
    }

    // Swaps Eth token to TkB token using algorithmic price determination
    function swapEthforTkB(address tokenB, uint256 _amountEth) external activePool returns(uint256 amountTkb) {
        require(_amountEth > 0, "amount can't be 0");
        amountTkb = getExactEthforTkB(_amountEth);

        totalEthToken += _amountEth;
        totalTkbToken -= amountTkb;
        K = totalEthToken * totalTkbToken;
        
        transferETH(address(this), _amountEth);
        Token(tokenB).transfer(msg.sender, amountTkb);
    }

    // Returns the amount of Eth token that the user will get when swapping a exact amount of Tkb token
    function getExactTkbforEth(uint256 _amountTkb) public view activePool returns(uint256 amountEth) {
        amountEth = getAmountOut(_amountTkb, totalTkbToken, totalEthToken);

        // To ensure that Token1's pool is not completely depleted leading to inf:0 ratio
        if(amountEth >= totalEthToken) amountEth = totalEthToken - 1;
    }
    
    // Returns the amount of Tkb token needed to swap a exact amount of Eth token
    function getTkbforExactEth(uint256 _amountEth) public view activePool returns(uint256 amountTkb) {
        require(_amountEth < totalEthToken, "Insufficient pool balance");
        amountTkb = getAmountIn(_amountEth, totalTkbToken, totalEthToken);
    }

    // Swaps TkB token to Eth token using algorithmic price determination
    function swapTkBforEth(address tokenB, uint256 _amountTkb) external activePool returns(uint256 amountEth) {
        require(_amountTkb > 0, "amount can't be 0");
        amountEth = getExactTkbforEth(_amountTkb);

        totalTkbToken += _amountTkb;
        totalEthToken -= amountEth;
        K = totalEthToken * totalTkbToken;

        transferETH(msg.sender, amountEth);
        Token(tokenB).transferFrom(msg.sender, address(this), _amountTkb);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn * 997;
        uint numerator = amountInWithFee * (reserveOut);
        uint denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {
        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint numerator = reserveIn * amountOut * 1000;
        uint denominator = (reserveOut - amountOut) * 997;
        amountIn = (numerator / denominator) + 1;
    }

    //to transfer ether
    function transferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'ETH transfer failed');
    }

}