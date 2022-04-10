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


    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({method: "eth_accounts"});
            if (accounts.length) {
               // const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
                const  provider = new ethers.providers.Web3Provider(window.ethereum);
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
        let response = await CAYTokenContract.balanceOf(address);
        console.log("token balance", response);
        setCurrentCAYTokenBalance(response)
        return response
    }

    const buyCAYTokens = async (etherAmount) => {
        let response = await swapContract.buyCAYTokens({ value:etherAmount });
        let res = await response.wait();
        console.log("res", res);
    }

    const sellCAYTokens = async (tokenAmount) => {
        let response  = await CAYTokenContract.approve(swapContract.address, tokenAmount)
        let response1 = await swapContract.sellCAYTokens(tokenAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        console.log("res0", res0);
        console.log("res1", res1);
    }

    const balanceKENToken = async (address) => {
        let response = await KENTokenContract.balance(address);
        console.log("token balance", response);
        setCurrentKENTokenBalance(response)
        return response
    }

    const buyKENTokens = async (etherAmount) => {
        let response = await swapContract.buyKENTokens({ value:etherAmount });
        let res = await response.wait();
        console.log("buyKENTokens", res);
    }

    const sellKENTokens = async (tokenAmount) => {
        let response  = await KENTokenContract.approve(swapContract.address, tokenAmount)
        let response1 = await swapContract.sellKENTokens(tokenAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        console.log("KENTokenContract.approve", res0);
        console.log("sellKENTokens", res1);
    }

    const createPool = async (CAYAmount, KENAmount) => {
        let response  = await CAYTokenContract.approve(poolContract.address, CAYAmount)
        let response1  = await KENTokenContract.approve(poolContract.address, KENAmount)
        let response2  = await poolContract.createPool(CAYAmount, KENAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        let res2 = await response2.wait();
        console.log("CAYTokenContract.approve", res0);
        console.log("KENTokenContract.approve", res1);
        console.log("createPool", res2);
    }

    const checkBothTokenAmountInPool = async () => {
        let response2  = await poolContract.checkBothTokenAmountInPool()
        console.log("checkBothTokenAmountInPool", response2);
    }

    useEffect(async () => {
        checkIfWalletIsConnect().then(r => console.log("r" + r));
    }, []);

    return (
        <TransactionContext.Provider value={{currentAccount, connectWallet,
            currentBalance, balanceCAYToken, balanceKENToken,buyCAYTokens,
            sellCAYTokens,buyKENTokens,sellKENTokens,createPool,checkBothTokenAmountInPool,
            currentCAYTokenBalance, currentKENTokenBalance
        }}>
            {children}
        </TransactionContext.Provider>
    )


};