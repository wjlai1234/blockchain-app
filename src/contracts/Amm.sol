// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract AMM {
    
    uint256 totalShare;
    uint256 totalEthToken;//total amount of Eth token in the pool
    uint256 totalTkbToken;//total amount of TkB token in the pool
    uint256 K;//K constant in X*Y = K
    
    uint constant PRECISION = 1_000_000;

    mapping(address => uint256) share;
    mapping(address => uint256) balanceEth;
    mapping(address => uint256) balanceCAY;

    //balance and quantity validity check
    modifier validCheck(mapping(address => uint256) storage tokenBalance, uint256 tokenQty) {
        require(tokenQty > 0, "Amount must more than zero.");
        require(tokenQty <= tokenBalance[msg.sender], "Not enough balance.");
        _;
    }
    
    //no share, cannot withdraw from liquidity pool
    modifier activePool() {
        require(totalShare > 0, "Empty pool, please add liquidity.");
        _;
    }

    //get the liquidity pool total Eth token, TkB token
    function getPoolInfo() external view returns(uint256, uint256) {
        return (totalEthToken, totalTkbToken);
    }

    //get user balance token in the pool
    function getUserPoolBalance() external view returns (uint256 amountEth, uint amountCAY, uint userShare) {
        amountEth = balanceEth[msg.sender];
        amountCAY = balanceCAY[msg.sender];
        userShare = share[msg.sender];
    }

    //to get the total Tkb token needed to add into pool
    function getAddPoolTkbRequirement(uint256 ethToken) public view activePool returns(uint256 reqCAYToken) {
        reqCAYToken = ethToken / totalEthToken * totalTkbToken ;
    }

    //to get the total eth token needed to add into pool
    function getAddPoolEthRequirement(uint256 tkbToken) public view activePool returns(uint256 reqEthToken) {
        reqEthToken = tkbToken / totalTkbToken * totalEthToken ;
    }


    //add liquidity into the pool, set K constant if first added, store share % into user
    function addLiquidity(uint256 addEthToken, uint256 addCAYToken) external validCheck (balanceEth, addEthToken) validCheck (balanceCAY, addCAYToken) returns(uint256 _share) {
        if(totalShare == 0) { // Genesis liquidity is issued 100 Shares
            _share = 100 * PRECISION;
        } else{
            uint256 share1 = addEthToken / totalEthToken * totalShare; 
            uint256 share2 = addCAYToken / totalTkbToken * totalShare;
            require(share1 == share2, "Equivalent value of tokens not provided...");
            _share = share1;
        }

        require(_share > 0, "Asset value less than threshold for contribution!");
        balanceEth[msg.sender] -= addEthToken;
        balanceCAY[msg.sender] -= addCAYToken;

        totalEthToken += addEthToken;
        totalTkbToken += addCAYToken;
        K = totalEthToken * totalTkbToken;

        totalShare += _share;
        share[msg.sender] += _share;
    }

    //get withdraw total tokens
    function getWithdrawToken(uint256 _share) public view activePool returns(uint256 withdrawEth, uint256 withdrawCAY) {
        require(_share <= totalShare, "Share should be less than or equal to Total Share");
        withdrawEth = _share / totalShare * totalEthToken;
        withdrawCAY = _share / totalShare * totalTkbToken;
    }

    //withdraw  tokens from pool and add the tokens back to user
    function withdraw(uint256 _share) external activePool validCheck(share, _share) returns(uint256 withdrawEth, uint256 withdrawTkb) {
        (withdrawEth, withdrawTkb) = getWithdrawToken(_share);
        
        share[msg.sender] -= _share;
        totalShare -= _share;

        totalEthToken -= withdrawEth;
        totalTkbToken -= withdrawTkb;
        K = totalEthToken * totalTkbToken;

        balanceEth[msg.sender] += withdrawEth;
        balanceCAY[msg.sender] += withdrawTkb;
    }

    // Returns the amount of CAY token that the user will get when swapping a exact amount of Eth token
    function getExactEthforCAY(uint256 _amountEth) public view activePool returns(uint256 amountCAY) {
        amountCAY = getAmountOut(_amountEth, totalEthToken, totalTkbToken);

        // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
        if(amountCAY == totalTkbToken) amountCAY--;
    }
    
    // Returns the amount of Eth token needed to swap a exact amount of CAY token
    function getEthforExactCAY(uint256 _amountTkB) public view activePool returns(uint256 amountEth) {
        require(_amountTkB < totalTkbToken, "Insufficient pool balance");
        amountEth = getAmountIn(_amountTkB, totalEthToken, totalTkbToken);
    }

    // Swaps Eth token to CAY token using algorithmic price determination
    function swapEthforTkB(uint256 _amountEth) external activePool validCheck(balanceEth, _amountEth) returns(uint256 amountTkb) {
        amountTkb = getExactEthforCAY(_amountEth);

        balanceEth[msg.sender] -= _amountEth;
        totalEthToken += _amountEth;
        totalTkbToken -= amountTkb;
        balanceCAY[msg.sender] += amountTkb;
    }

    // Returns the amount of Eth token that the user will get when swapping a exact amount of Tkb token
    function getExactTkbforEth(uint256 _amountCAY) public view activePool returns(uint256 amountEth) {
        amountEth = getAmountOut(_amountCAY, totalTkbToken, totalEthToken);

        // To ensure that Token1's pool is not completely depleted leading to inf:0 ratio
        if(amountEth == totalEthToken) amountEth--;
    }
    
    // Returns the amount of Tkb token needed to swap a exact amount of Eth token
    function getTkbforExactEth(uint256 _amountEth) public view activePool returns(uint256 amountCAY) {
        require(_amountEth < totalEthToken, "Insufficient pool balance");
        amountCAY = getAmountIn(_amountEth, totalTkbToken, totalEthToken);
    }

    // Swaps TkB token to Eth token using algorithmic price determination
    function swapTkBforEth(uint256 _amountCAY) external activePool validCheck(balanceCAY, _amountCAY) returns(uint256 amountEth) {
        amountEth = getExactTkbforEth(_amountCAY);

        balanceCAY[msg.sender] -= _amountCAY;
        totalTkbToken += _amountCAY;
        totalEthToken -= amountEth;
        balanceEth[msg.sender] += amountEth;
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



}