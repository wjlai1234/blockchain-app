import ethLogo from "../images/eth-logo.png";
import tokenLogo from "../images/img.png";
import {useContext, useEffect, useState} from "react";
import {TransactionContext} from "../context/TransactionContext";
import './Swap.css';
import ErrorBoundary from "../context/ErrorBoundary";

const ethers = require('ethers')

const Dropdown = ({label, value, options, onChange}) => {
    return (
        <label>
            {label}
            <select value={value} onChange={onChange} style={{backgroundColor: "black"}}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};

const SwapItem = (props) => {

    const {
        buyCAYTokens,
        buyKENTokens,
        KENTokenContract,
        CAYTokenContract,
        setCurrentCAYTokenBalance,
        setCurrentKENTokenBalance,
        sellKENTokens,
        sellCAYTokens,
        currentCAYTokenBalance,
        balanceCAYToken,
        balanceKENToken,
        currentKENTokenBalance,
        currentAccount,
        currentBalance
    } = useContext(TransactionContext);
    const [coin, setCoin] = useState(["ETH", "CAY", "KEN"]);
    const [etherAmount, setEtherAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);

    const options = [
        {label: coin[1], value: 1},
        {label: coin[2], value: 2},
    ];



    const [value, setValue] = useState(1);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            <div id="form" onSubmit={(event) => {

            }}>
                <div className="flex justify-content-end">
                    <span className="float-left text-white">Balance: {currentBalance} {coin[0]}</span>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="from_token_select">
                        <img src={ethLogo} className="token_image select-none " id="from_token_img" alt=""/>
                        <span className="p-3  select-none" id="from_token_text">{coin[0]}</span>
                    </div>

                    <div className="swapbox_select">
                        <input
                            onChange={(event) => {
                                const etherAmount = event.target.value.toString()
                                console.log("etherAmount" + etherAmount);
                                let formatAmount = etherAmount * 100
                                setTokenAmount(formatAmount)
                                console.log("tokenAmount" + formatAmount);
                                setEtherAmount(etherAmount)
                            }}
                            className="number form-control select-none" placeholder="amount" id="from_amount"
                        />
                    </div>
                </div>

                <div className="flex justify-content-end">
                    <span className="float-left text-white">
                        Balance: {coin[value] == 'CAY' ? currentCAYTokenBalance : currentKENTokenBalance}
                        {" " + coin[value]}
                    </span>

                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="to_token_select">
                        <img src={tokenLogo} className="token_image select-none" id="to_token_img" alt=""/>
                        <span className="p-3 select-none" id="to_token_text">
                            <Dropdown
                                options={options}
                                value={value}
                                onChange={handleChange}
                            />
                        </span>
                    </div>

                    <div className="swapbox_select">
                        <input className="number form-control select-none" placeholder="amount" id="from_amount"
                               disabled value={tokenAmount}/>
                    </div>
                </div>

                <div className="flex justify-content-between text-white mb-3">
                    <span className=" text-white">Exchange Rate</span>
                    <span className=" text-white">1 ETH = 100 {coin[value]}</span>
                </div>

                <button type="submit" className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            if (coin[value] === "CAY") {
                                const buy = ethers.utils.parseUnits(etherAmount, "ether");
                                console.log("formatEther" + buy)
                                buyCAYTokens(buy)
                            } else {
                                const buy = ethers.utils.parseUnits(etherAmount, "ether");
                                console.log("formatEther" + buy)
                                buyKENTokens(buy)
                            }
                        }}
                >
                    Swap
                </button>
                <button type="submit" className="bg-[#2952e3] py-2 px-7 float-right rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            balanceCAYToken(currentAccount);
                            balanceKENToken(currentAccount);
                        }}
                >
                    Check
                </button>
            </div>
        </div>
    );
};

const SellItem = (props) => {

    const {
        KENTokenContract,
        CAYTokenContract,
        setCurrentCAYTokenBalance,
        setCurrentKENTokenBalance,
        sellKENTokens,
        sellCAYTokens,
        currentCAYTokenBalance,
        balanceCAYToken,
        balanceKENToken,
        currentKENTokenBalance,
        currentAccount,
        currentBalance
    } = useContext(TransactionContext);
    const [coin, setCoin] = useState(["ETH", "CAY", "KEN"]);
    const [etherAmount, setEtherAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);




    const options = [
        {label: coin[1], value: 1},
        {label: coin[2], value: 2},
    ];

    const [value, setValue] = useState(1);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            <div id="form" onSubmit={(event) => {

            }}>
                <div className="flex justify-content-end">
                    <span className="float-left text-white">
                        Balance: {coin[value] == 'CAY' ? currentCAYTokenBalance : currentKENTokenBalance}
                        {" " + coin[value]}
                    </span>
                </div>

                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="to_token_select">
                        <img src={tokenLogo} className="token_image select-none" id="to_token_img" alt=""/>
                        <span className="p-3 select-none" id="to_token_text">
                            <Dropdown
                                options={options}
                                value={value}
                                onChange={handleChange}
                            />
                        </span>
                    </div>

                    <div className="swapbox_select">
                        <input onChange={(event) => {
                            const tokenAmount = event.target.value.toString()
                            console.log("tokenAmount" + tokenAmount);
                            setEtherAmount(tokenAmount / 100)
                            setTokenAmount(tokenAmount)
                        }}
                               className="number form-control" placeholder="amount" id="to_amount"/>
                    </div>
                </div>

                <div className="flex justify-content-end">
                    <span className="float-left text-white">Balance: {currentBalance} {coin[0]}</span>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="from_token_select">
                        <img src={ethLogo} className="token_image select-none " id="from_token_img" alt=""/>
                        <span className="p-3  select-none" id="from_token_text">{coin[0]}</span>
                    </div>

                    <div className="swapbox_select">
                        <input className="number form-control select-none" placeholder="amount" id="from_amount"
                               disabled value={etherAmount}/>
                    </div>
                </div>

                <div className="flex justify-content-between text-white mb-3">
                    <span className=" text-white">Exchange Rate</span>
                    <span className=" text-white">1 ETH = 100 {coin[value]}</span>
                </div>

                <button type="submit" className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            if (coin[value] === 'CAY') {
                                const buy = ethers.utils.parseUnits(tokenAmount, "ether");
                                console.log("formatUnits" + buy)
                                sellCAYTokens(buy)
                            } else {
                                const buy = ethers.utils.parseUnits(tokenAmount, "ether");
                                console.log("formatUnits" + buy)
                                sellKENTokens(buy)
                            }
                            balanceCAYToken(currentAccount);
                            balanceKENToken(currentAccount);
                        }}
                >
                    Swap
                </button>
                <button type="submit" className="bg-[#2952e3] py-2 px-7 float-right rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            balanceCAYToken(currentAccount);
                            balanceKENToken(currentAccount);
                        }}
                >
                    Check
                </button>
            </div>
        </div>
    );
};

const Main = () => {
    const [activeTab, setActiveTab] = useState("Buy");
    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="gradient-bg-transactions pb-20">
            <div className="container ">
                <div className="row">
                    <div className="col col-md-6 offset-md-3 white-glassmorphism" id="window">
                        <div className="selectTab">
                            <div
                                className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
                                onClick={() => changeTab("Buy")}
                            >
                                <h4 className="swapheader">Buy</h4>
                            </div>

                            <div
                                className={
                                    "tabStyle " + (activeTab === "AddLiquidity" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("Sell")}
                            >
                                <h4 className="swapheader">Sell</h4>

                            </div>
                        </div>

                        <hr/>

                        {activeTab === "Buy" ?<ErrorBoundary><SwapItem tab="Swap"/> </ErrorBoundary> : <ErrorBoundary><SellItem tab="Swap"/></ErrorBoundary> }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
