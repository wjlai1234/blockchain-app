import {createContext, useEffect, useState} from "react";
import Token from '../contracts/Token.json'
import Swap from '../contracts/Swap.json'

const ethers = require('ethers')
const {ethereum} = window;
export const TransactionContext = createContext(undefined);

export const TransactionsProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0.00);
    const [currentTokenBalance, setCurrentTokenBalance] = useState(0.00);
    const [tokenContract, setTokenContract] = useState(null);
    const [swapContract, setSwapContract] = useState(null);

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
                    ///Load Token Contract
                    const tokenData = Token.networks[networkId]
                    if (tokenData) {
                        const token = new ethers.Contract(tokenData.address, Token.abi, signer);console.log("token:" + token.toString());
                        setTokenContract(token)
                    } else {
                        window.alert('Token contract not deployed to detected network.')
                    }

                    //Load Swap Contract
                    const swapData = Swap.networks[networkId]
                    if (swapData) {
                        const swap = new ethers.Contract(swapData.address, Swap.abi, signer);console.log("swap:" + swap);
                        setSwapContract(swap)

                    } else {
                        window.alert('Swap contract not deployed to detected network.')
                    }
                    //Load Pool Contract
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
    const buyTokens = async (etherAmount) => {
        let response = await swapContract.buyTokens({ value:etherAmount });
        let res = await response.wait();
        console.log("res", res);
    }
    const balance = async (address) => {
        console.log("token address", address);
        let response = await tokenContract.balance(address);
        let balance = await response.wait();
        setCurrentBalance(balance)
        console.log("token balance", balance);
    }

    const sellTokens = async (tokenAmount) => {
        let response  = await tokenContract.approve(swapContract.address, tokenAmount)
        let response1 = await swapContract.sellTokens(tokenAmount)
        let res0 = await response.wait();
        let res1 = await response1.wait();
        console.log("res0", res0);
        console.log("res1", res1);
    }
    useEffect(async () => {
        checkIfWalletIsConnect().then(r => console.log("r" + r));
        let result = await balance("0x1770356BaD37D5AAa942723b40e7d225dDe1E9BD")

    }, []);

    return (
        <TransactionContext.Provider value={{currentAccount, connectWallet, currentBalance, buyTokens, sellTokens}}>
            {children}
        </TransactionContext.Provider>
    )


};