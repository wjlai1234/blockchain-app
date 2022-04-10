import {createContext, useEffect, useState} from "react";
import CAYTOKEN from '../abis/CAYTOKEN.json';
import KENTOKEN from '../abis/KENTOKEN.json';
import Swap from '../abis/EthSwap.json';
import Pool from '../abis/AMM.json';

const ethers = require('ethers')
const {ethereum} = window;
export const TransactionContext = createContext(undefined);

export const TransactionsProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0.00);
    const [currentCAYTokenBalance, setCurrentCAYTokenBalance] = useState(0.00);
    const [currentKENTokenBalance, setCurrentKENTokenBalance] = useState(0.00);
    const [CAYTokenContract, setCAYTokenContract] = useState(null);
    const [KENTokenContract, setKENTokenContract] = useState(null);
    const [swapContract, setSwapContract] = useState(null);
    const [poolContract, setPoolContract] = useState(null);
    const [cayPoolAmount, setCAYPoolAmount] = useState(0.00);
    const [kenPoolAmount, setKENPoolAmount] = useState(0.00);
    const [cayReqAmount, setCayReqAmount] = useState(0.00);
    const [kenReqAmount, setKenReqAmount] = useState(0.00);
    const [cayEstTokenAmount, setEstCayTokenAmount] = useState(0.00);
    const [kenEstTokenAmount, setEstKenTokenAmount] = useState(0.00);
    const [lpCayBalance, setLpCayBalance] = useState(0.00);
    const [lpKenBalance, setLpKenBalance] = useState(0.00);
    const [cayEstWithdrawAmount, setCayEstWithdrawAmount] = useState(0.00);
    const [kenEstWithdrawAmount, setKenEstWithdrawAmount] = useState(0.00);

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({method: "eth_requestAccounts",});
            setCurrentAccount(accounts[0]);
            console.log(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    const resetWallet = async () => {
        const accounts = await ethereum.request({method: "eth_requestAccounts",});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider.getBalance(accounts[0]).then((balance) => {
            // convert a currency unit from wei to ether
            const balanceInEth = ethers.utils.formatEther(balance)
            setCurrentBalance(balanceInEth);
            console.log(`balance: ${balanceInEth} ETH`)
        }).catch(err => console.log(err));
        setCurrentAccount(accounts[0]);
    }

    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({method: "eth_accounts"});
            if (accounts.length) {
                // const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                console.log("provider:" + provider);
                const address = accounts[0]

                let signer;
                signer = provider.getSigner()
                const networkId = 5777

                try {
                    ///Load CAY TOKEN Contract
                    const cayTokenData = CAYTOKEN.networks[networkId]
                    if (cayTokenData) {
                        const cayToken = new ethers.Contract(cayTokenData.address, CAYTOKEN.abi, signer);
                        console.log("token:" + cayToken.toString());
                        setCAYTokenContract(cayToken)
                    } else {
                        window.alert('CAY Token contract not deployed to detected network.')
                    }

                    ///Load CAY TOKEN Contract
                    const kenTokenData = KENTOKEN.networks[networkId]
                    if (kenTokenData) {
                        const kenToken = new ethers.Contract(kenTokenData.address, KENTOKEN.abi, signer);
                        console.log("token:" + kenToken.toString());
                        setKENTokenContract(kenToken)
                    } else {
                        window.alert('KEN Token contract not deployed to detected network.')
                    }

                    //Load Swap Contract
                    const swapData = Swap.networks[networkId]
                    if (swapData) {
                        const swap = new ethers.Contract(swapData.address, Swap.abi, signer);
                        console.log("swap:" + swap);
                        setSwapContract(swap)
                    } else {
                        window.alert('Swap contract not deployed to detected network.')
                    }
                    //Load Pool Contract]
                    const poolData = Pool.networks[networkId]
                    if (poolData) {
                        const pool = new ethers.Contract(poolData.address, Pool.abi, signer);
                        console.log("pool:" + pool);
                        setPoolContract(pool)
                    } else {
                        window.alert('Pool contract not deployed to detected network.')
                    }
                } catch (err) {
                    alert("CONTRACT_ADDRESS not set properly");
                    console.log("err:" + err);
                }

                provider.getBalance(address).then((balance) => {
                    // convert a currency unit from wei to ether
                    const balanceInEth = ethers.utils.formatEther(balance)
                    setCurrentBalance(balanceInEth);
                    console.log(`balance: ${balanceInEth} ETH`)
                }).catch(err => console.log(err));
                setCurrentAccount(accounts[0]);


                console.log("Account Found!" + accounts[0]);
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    };

    const balanceCAYToken = async (address) => {
        let response = ethers.utils.formatUnits(await CAYTokenContract.balanceOf(address), 18);
        console.log("token balance", response);
        setCurrentCAYTokenBalance(response)

    }

    const buyCAYTokens = async (etherAmount) => {
        let response = await swapContract.buyCAYTokens({value: etherAmount});
        let res = await response.wait();
        console.log("res", res);
    }

    const sellCAYTokens = async (tokenAmount) => {
        let response = await CAYTokenContract.approve(swapContract.address, tokenAmount)
        let response1 = await swapContract.sellCAYTokens(tokenAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        console.log("res0", res0);
        console.log("res1", res1);
    }

    const balanceKENToken = async (address) => {
        let balance = ethers.utils.formatUnits(await KENTokenContract.balanceOf(address), 18);
        console.log("token balance", balance);
        setCurrentKENTokenBalance(balance)

    }

    const buyKENTokens = async (etherAmount) => {
        let response = await swapContract.buyKENTokens({value: etherAmount});
        let res = await response.wait();
        console.log("buyKENTokens", res);
    }

    const sellKENTokens = async (tokenAmount) => {
        let response = await KENTokenContract.approve(swapContract.address, tokenAmount)
        let response1 = await swapContract.sellKENTokens(tokenAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        console.log("KENTokenContract.approve", res0);
        console.log("sellKENTokens", res1);
    }

    const createPool = async (CAYAmount, KENAmount) => {
        let response = await CAYTokenContract.approve(poolContract.address, CAYAmount)
        let response1 = await KENTokenContract.approve(poolContract.address, KENAmount)
        let response2 = await poolContract.createPool(CAYAmount, KENAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        let res2 = await response2.wait();
        console.log("CAYTokenContract.approve", res0);
        console.log("KENTokenContract.approve", res1);
        console.log("createPool", res2);
    }

    const checkBothTokenAmountInPool = async () => {
        let response = (await poolContract.checkBothTokenAmountInPool());
        let response0 = ethers.utils.formatUnits(response[0], 18)
        let response1 = ethers.utils.formatUnits(response[1], 18)
        console.log("checkBothTokenAmountInPool",);
        console.log("checkBothTokenAmountInPool",);
        setCAYPoolAmount(response0);
        setKENPoolAmount(response1);

    }

    const getAddPoolCAYRequirement = async (KENAmount) => {
        let response = await poolContract.getAddPoolCAYRequirement(KENAmount)
        setCayReqAmount(response)
        console.log("getAddPoolCAYRequirement", response);
    }

    const getAddPoolKENRequirement = async (CAYAmount) => {
        let response = await poolContract.getAddPoolKENRequirement(CAYAmount)
        setKenReqAmount(response)
        console.log("getAddPoolKENRequirement", response);
    }

    const swapCAYforKEN = async (CAYAmount) => {
        let response  = await CAYTokenContract.approve(poolContract.address, CAYAmount)
        let response1  = await KENTokenContract.approve(poolContract.address, CAYAmount)
        let response2  = await poolContract.swapCAYforKEN(CAYAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        let res2 = await response2.wait();
        console.log("swapCAYforKEN", res0);
        console.log("swapCAYforKEN1", res1);
        console.log("swapCAYforKEN2", res2);
    }

    const getExactCAYforKEN = async (CAYAmount) => {
        let response = await poolContract.getExactCAYforKEN(CAYAmount)
        setEstKenTokenAmount(response)
        console.log("getExactCAYforKEN", response);
    }

    const swapKENforCAY = async (KENAmount) => {
        let response  = await CAYTokenContract.approve(poolContract.address, KENAmount)
        let response1  = await KENTokenContract.approve(poolContract.address, KENAmount)
        let response2  = await poolContract.swapKENforCAY(KENAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        let res2 = await response2.wait();
        console.log("swapCAYforKEN", res0);
        console.log("swapCAYforKEN1", res1);
        console.log("swapCAYforKEN2", res2);
    }

    const getExactKENforCAY = async (KENAmount) => {
        let response = await poolContract.getExactKENforCAY(KENAmount)
        setEstCayTokenAmount(response)
        console.log("getExactKENforCAY", response);
    }

    const getLPTotalCAY = async () => {
        let response =  ethers.utils.formatUnits(await poolContract.getLPTotalCAY(), 18)
        setLpCayBalance(response)
        console.log("getLPTotalCAY", response);
    }

    const getLPTotalKEN = async () => {
        let response = ethers.utils.formatUnits(await poolContract.getLPTotalKEN(), 18)
        setLpKenBalance(response)
        console.log("getLPTotalKEN", response);
    }

    const getWithdrawToken = async (WithdrawPercentage) => {
        let response = await poolContract.getWithdrawToken(WithdrawPercentage)
        setLpCayBalance(response)
        setLpKenBalance(response)
        console.log("getWithdrawToken", response);
    }

    const withdraw = async (WithdrawPercentage) => {
        let response = await poolContract.withdraw(WithdrawPercentage)
        console.log("withdraw", response);
    }

    useEffect(() => {
        setCAYPoolAmount(JSON.parse(window.sessionStorage.getItem("cayPoolAmount")));
        setKENPoolAmount(JSON.parse(window.sessionStorage.getItem("kenPoolAmount")));
        setLpCayBalance(JSON.parse(window.sessionStorage.getItem("lpCayBalance")));
        setLpKenBalance(JSON.parse(window.sessionStorage.getItem("lpKenBalance")));
    }, []);

    useEffect( () => {
        checkIfWalletIsConnect().then(r => console.log("r" + r));
        window.sessionStorage.setItem("cayPoolAmount", cayPoolAmount);
        window.sessionStorage.setItem("kenPoolAmount", kenPoolAmount);
        window.sessionStorage.setItem("lpCayBalance", lpCayBalance);
        window.sessionStorage.setItem("lpKenBalance", lpKenBalance);
    }, [cayPoolAmount,kenPoolAmount,lpKenBalance,lpCayBalance]);

    return (
        <TransactionContext.Provider
            value={{
                currentAccount, connectWallet,
                currentBalance, balanceCAYToken, balanceKENToken, buyCAYTokens,
                sellCAYTokens, buyKENTokens, sellKENTokens, createPool, checkBothTokenAmountInPool,
                getAddPoolCAYRequirement, getAddPoolKENRequirement,
                swapCAYforKEN, swapKENforCAY, getExactCAYforKEN,
                getExactKENforCAY,  getLPTotalCAY, getLPTotalKEN,
                getWithdrawToken, withdraw,resetWallet,
                cayReqAmount, kenReqAmount, cayEstTokenAmount, kenEstTokenAmount,
                lpCayBalance, lpKenBalance,
                currentCAYTokenBalance, currentKENTokenBalance, KENTokenContract, setCurrentKENTokenBalance,
                setCurrentCAYTokenBalance, CAYTokenContract, kenPoolAmount, cayPoolAmount,
            }}>
            {children}
        </TransactionContext.Provider>
    )


};