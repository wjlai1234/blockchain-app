import ethLogo from "../images/eth-logo.png";
import tokenLogo from "../images/img.png";
import {useContext, useEffect, useState} from "react";
import {TransactionContext} from "../context/TransactionContext";
import {MdSwapVert, MdAdd} from "react-icons/md";
import { useRanger } from 'react-ranger';
import './Swap.css';

const ethers = require('ethers')

const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} onChange={onChange} style={{ backgroundColor: "black"}}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };

const SwapItem = (props) => {

    const {buyTokens, sellTokens, currentBalance} = useContext(TransactionContext);
    const [coin, setCoin] = useState(["ETH", "CAY", "KEN"]);
    const [etherAmount, setEtherAmount] = useState(0);
    const [tokenAAmount, setTokenAAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [tokenBAmount, setTokenBAmount] = useState(0);
    const rev = () => {
        setCoin([...coin.reverse()]);
    };
    const options = [
        { label: coin[1], value: coin[1] },
        { label: coin[2], value: coin[2] },
    ];

    const [value, setValue] = useState(coin[1]);

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
                        {coin[0] === "CAY" &&
                        (
                            <input onChange={(event) => {
                                const tokenAmount = event.target.value.toString()
                                console.log("tokenAmount" + tokenAmount);
                                setEtherAmount(tokenAmount / 100)
                                setTokenAmount(tokenAmount)
                            }}
                                   className="number form-control" placeholder="amount" id="to_amount"/>
                        )
                        }
                        {coin[0] === "ETH" && (
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
                        )}
                    </div>
                </div>

                {props.tab === "Swap" && (
                    <div className="flex justify-center " onClick={() => rev()}>
                        <MdSwapVert className="object-center text-3xl hover:rotate-180"/>
                    </div>)}

                <div className="flex justify-content-end">
                    <span className="float-left text-white">Balance: {currentBalance} {coin[1]}</span>

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
                        {coin[1] === "ETH" && (
                            <input className="number form-control select-none" placeholder="amount" id="from_amount"
                                   disabled value={etherAmount}/>
                        )}
                        {coin[1] === "CAY" && (
                            <input className="number form-control select-none" placeholder="amount" id="from_amount"
                                   disabled value={tokenAmount}/>
                        )}
                    </div>
                </div>

                {props.tab === "Swap" && coin[0] === "ETH" &&
                (<div className="flex justify-content-between text-white mb-3">
                    <span className=" text-white">Exchange Rate</span>
                    <span className=" text-white">1 ETH = 100 CAY</span>
                </div>)
                }
                {props.tab === "Swap" && coin[0] === "CAY" &&
                (<div className="flex justify-content-between text-white mb-3">
                    <span className=" text-white">Exchange Rate</span>
                    <span className=" text-white">100 CAY = 1 ETH</span>
                </div>)
                }
                <button type="submit" className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            if (coin[0] === "ETH") {
                                const buy = ethers.utils.parseUnits(etherAmount, "ether");
                                console.log("formatEther" + buy)
                                buyTokens(buy)
                            } else {
                                const buy = ethers.utils.parseUnits(tokenAmount, "ether");
                                console.log("formatUnits" + buy)
                                sellTokens(buy)
                            }
                        }}
                >
                    Swap
                </button>
            </div>
        </div>
    );
};

const Main = () => {
    const [activeTab, setActiveTab] = useState("Pool");
    const changeTab = (tab) => {
        setActiveTab(tab);
    };
    return (
        <div className="gradient-bg-transactions pb-20">
            <div className="container ">
                <div className="row">
                    <div className="col col-md-6 offset-md-3 white-glassmorphism" id="window">
                        <SwapItem tab="Swap"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
