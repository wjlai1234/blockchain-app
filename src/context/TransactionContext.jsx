import {createContext, useEffect, useState} from "react";
import Token from '../contracts/Token.json'
import Swap from '../contracts/Swap.json'

const ethers = require('ethers')
const {ethereum} = window;
export const TransactionContext = createContext(undefined);

export const TransactionsProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0.00);
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
                const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
                console.log("provider:" + provider);
                const address = accounts[0]
                let signer;

                signer = provider.getSigner()
                console.log("signer:" + signer);
                try {
                    //Load Token
                    //  const networkId =   (await providers.getNetwork()).chainId
                    const networkId = 5777
                    console.log("networkId:" + networkId);
                    const tokenData = Token.networks[networkId]
                    console.log("tokenData:" + tokenData);
                    console.log("tokenData:" + tokenData.address);
                    if (tokenData) {
                        const token = new ethers.Contract(tokenData.address, Token.abi, signer);
                        console.log("token:" + token);
                        setTokenContract(token)
                    } else {
                        window.alert('Token contract not deployed to detected network.')
                    }

                    //Load Swap
                    const swapData = Swap.networks[networkId]
                    console.log("swapData:" + swapData);
                    console.log("swapData:" + swapData.address);
                    if (swapData) {
                        const swap = new ethers.Contract(swapData.address, Swap.abi, signer);
                        console.log("swap:" + swap);
                        setSwapContract(swap)
                    } else {
                        window.alert('Swap contract not deployed to detected network.')
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
    const buyTokens = async (etherAmount) => {
        swapContract.c
        await console.log(swapContract)
        await swapContract.buyTokens().send({
            value: etherAmount,
            from: currentAccount
        }).on('transactionHash', (hash) => {
            console.log(hash)

        })
    }

    const sellTokens = async (tokenAmount) => {
        await console.log(tokenContract)
        await tokenContract.approve(swapContract.address, tokenAmount).send({from: currentAccount}).on('transactionHash', (hash) => {
            swapContract.sellTokens(tokenAmount).send({from: currentAccount}).on('transactionHash', (hash) => {
            })
        })
    }
    useEffect(() => {
        checkIfWalletIsConnect().then(r => console.log("r" + r));
    }, []);

    return (
        <TransactionContext.Provider value={{currentAccount, connectWallet, currentBalance, buyTokens, sellTokens}}>
            {children}
        </TransactionContext.Provider>
    )


};