import {createContext, useEffect, useState} from "react";

const {ethereum} = window;
export const TransactionContext = createContext();

export const TransactionsProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");

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

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                console.log(accounts[0]);
                console.log("Account Found!");
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    };

    useEffect(() => {
        checkIfWalletIsConnect();
    }, []);

    return (
        <TransactionContext.Provider value={{currentAccount,connectWallet}}>
            {children}
        </TransactionContext.Provider>
    )


};