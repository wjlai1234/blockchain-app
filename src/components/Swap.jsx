import ethLogo from "../images/eth-logo.png";
import tokenLogo from "../images/img.png";
import tokenLogo2 from "../images/img2.png";
import {useContext, useEffect, useState} from "react";
import {TransactionContext} from "../context/TransactionContext";
import {MdSwapVert, MdAdd} from "react-icons/md";
import {useRanger} from 'react-ranger';
import './Swap.css';

const ethers = require('ethers')

const SwapItem = (props) => {
    const {
        getExactKENforCAY,
        swapCAYforKEN,
        swapKENforCAY,
        kenPoolAmount,
        cayPoolAmount,
        kenEstTokenAmount,
        getExactCAYforKEN,
        cayEstTokenAmount,
        checkBothTokenAmountInPool
    } = useContext(TransactionContext);
    const [coin, setCoin] = useState(["CAY", "KEN"]);
    const [pool, setPool] = useState([cayPoolAmount,kenPoolAmount]);
    const [cayAmount, setCayAmount] = useState(0);
    const [kenAmount, setKenAmount] = useState(0);
    const rev = () => {
        setCoin([...coin.reverse()]);
        setPool([...pool.reverse()]);
    };

    return (
        <div>
            <div id="form" onSubmit={(event) => {

            }}>
                <div className="flex justify-content-end">
                        <span className="float-left text-white">Balance: {pool[0]} {coin[0]}</span>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="from_token_select">
                        <img src={coin[0] === "CAY" ? tokenLogo : tokenLogo2} className="token_image select-none " id="from_token_img" alt=""/>
                        <span className="p-3  select-none" id="from_token_text">{coin[0]}</span>
                    </div>

                    <div className="swapbox_select">
                        {coin[0] === "KEN" &&
                        (
                            <input onChange={(event) => {
                                const kenAmount = event.target.value.toString()
                                console.log("kenAmount" + kenAmount);
                                setKenAmount(kenAmount)
                                getExactKENforCAY(kenAmount)
                            }}
                                   className="number form-control" placeholder="amount" id="to_amount"/>
                        )
                        }
                        {coin[0] === "CAY" && (
                            <input
                                onChange={(event) => {
                                    const cayAmount = event.target.value.toString()
                                    console.log("cayAmount" + cayAmount);
                                    let formatAmount = cayAmount
                                    setCayAmount(cayAmount)
                                    getExactCAYforKEN(cayAmount)
                                }}
                                className="number form-control select-none" placeholder="amount" id="from_amount"
                            />
                        )}
                    </div>
                </div>

                {props.tab === "Swap" && (
                    <div className="flex justify-center " onClick={() => rev()} style={{ cursor: "pointer" }}>
                        <MdSwapVert className="object-center text-3xl hover:rotate-180"/>
                    </div>)}
                <div className="flex justify-content-end">
                        <span className="float-left text-white">Balance: {pool[1]} {coin[1]}</span>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="to_token_select">
                        <img src={coin[1] === "CAY" ? tokenLogo : tokenLogo2} className="token_image select-none" id="to_token_img" alt=""/>
                        <span className="p-3 select-none" id="to_token_text">{coin[1]}</span>
                    </div>


                    <div className="swapbox_select">
                        {coin[1] === "CAY" && (
                            <input className="number form-control select-none" placeholder="amount" id="from_amount"
                                   disabled value={cayEstTokenAmount}/>
                        )}
                        {coin[1] === "KEN" && (
                            <input className="number form-control select-none" placeholder="amount" id="from_amount"
                                   disabled value={kenEstTokenAmount}/>
                        )}
                    </div>
                </div>
                <button type="submit" className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={async () => {
                            if (coin[0] === "CAY") {
                                const cayActAmount = ethers.utils.parseUnits(cayAmount.toString(), "ether");
                                console.log("cayActAmount" + cayActAmount)
                                swapCAYforKEN(cayActAmount);
                            } else {
                                const kenActAmount = ethers.utils.parseUnits(kenAmount.toString(), "ether");
                                console.log("cayActAmount" + kenActAmount)
                                swapKENforCAY(kenActAmount);
                            }
                        }}
                >
                    Swap
                </button>
                <button type="submit"
                        className="bg-[#2952e3] py-2 px-7 float-right rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            checkBothTokenAmountInPool()
                        }}
                >
                    Check
                </button>
            </div>
        </div>
    );
};

const AddLiquidity = () => {
    const {
        createPool,
        checkBothTokenAmountInPool,
        getAddPoolCAYRequirement,
        getAddPoolKENRequirement,
        cayReqAmount,
        cayPoolAmount,
        kenPoolAmount,
        getLPTotalCAY,
        getLPTotalKEN
    } = useContext(TransactionContext);
    const [coin, setCoin] = useState(["KEN", "CAY"]);
    const [CAYAmount, setCAYAmount] = useState(0.0);
    const [KENAmount, setKENAmount] = useState(0.0);
    const [toggleReq, setToggleReq] = useState(false);

    const rev = () => {
        setCoin([...coin.reverse()]);
    };

    useEffect(() => {
        setToggleReq(JSON.parse(window.sessionStorage.getItem("toggleReq")));
    }, []);

    useEffect(() => {
        window.sessionStorage.setItem("toggleReq", toggleReq);
    }, [toggleReq]);

    return (
        <div>
            <div id="form" onSubmit={(event) => {

            }}>
                <div className="flex justify-content-end">
                    <span className="float-left text-white">Balance: {kenPoolAmount} KEN</span>
                </div>

                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="from_token_select">
                        <img src={tokenLogo2} className="token_image select-none " id="from_token_img" alt=""/>
                        <span className="p-3  select-none" id="from_token_text">{coin[0]}</span>
                    </div>

                    <div className="swapbox_select">
                        {toggleReq === false && (
                            <input
                                onChange={(event) => {
                                    const kenAmount = event.target.value.toString()
                                    console.log("kenAmount" + kenAmount);
                                    setKENAmount(kenAmount)

                                }}
                                // value={kenReqAmount}
                                className="number form-control select-none" placeholder="amount" id="from_amount"
                            />)}
                        {toggleReq === true && (
                            <input
                                onChange={(event) => {
                                    const kenAmount = event.target.value.toString()
                                    console.log("kenAmount" + kenAmount);
                                    setKENAmount(kenAmount)
                                    getAddPoolCAYRequirement(kenAmount)
                                }}
                                // value={kenReqAmount}
                                className="number form-control select-none" placeholder="amount" id="from_amount"
                            />)}
                    </div>
                </div>

                <div className="flex justify-center ">
                    <MdAdd className="object-center text-3xl hover:rotate-180"/>
                </div>

                <div className="flex justify-content-end">
                    <span className="float-left text-white">Balance: {cayPoolAmount} CAY</span>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="to_token_select">
                        <img src={tokenLogo} className="token_image select-none" id="to_token_img" alt=""/>
                        <span className="p-3 select-none" id="to_token_text">{coin[1]}</span>
                    </div>

                    <div className="swapbox_select">
                        {(toggleReq == false && <input
                            onChange={(event) => {
                                const cayAmount = event.target.value.toString()
                                console.log("cayAmount" + cayAmount);
                                setCAYAmount(cayAmount)

                            }}


                            className="number form-control select-none" placeholder="amount" id="from_amount"
                        />)}
                        {(toggleReq == true && <input
                            onChange={(event) => {
                                const cayAmount = event.target.value.toString()
                                console.log("cayAmount" + cayAmount);
                                setCAYAmount(cayAmount)
                                getAddPoolKENRequirement(cayAmount)
                            }}

                            value={cayReqAmount}
                            className="number form-control select-none" placeholder="amount" id="from_amount" 
                        />)}
                    </div>
                </div>

                {(toggleReq == true && <button type="submit"
                                               className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                                               id="swap_button"
                                               onClick={() => {
                                                   const cayAmount = ethers.utils.parseUnits(cayReqAmount.toString(), "ether");
                                                   console.log("cayAmount" + cayAmount)
                                                   const kenAmount = ethers.utils.parseUnits(KENAmount.toString(), "ether");
                                                   console.log("kenAmount" + kenAmount)
                                                   createPool(cayAmount, kenAmount)

                                               }
                                               }
                >
                    Add
                </button>)}
                {(toggleReq == false && <button type="submit"
                                               className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                                               id="swap_button"
                                               onClick={() => {
                                                   const cayAmount = ethers.utils.parseUnits(CAYAmount.toString(), "ether");
                                                   console.log("cayAmount" + cayAmount)
                                                   const kenAmount = ethers.utils.parseUnits(KENAmount.toString(), "ether");
                                                   console.log("kenAmount" + kenAmount)
                                                   createPool(cayAmount, kenAmount)
                                                   setToggleReq(true)
                                               }
                                               }
                >
                    Add
                </button>)}
                <button type="submit"
                        className="bg-[#2952e3] py-2 px-7 float-right rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button"
                        onClick={() => {
                            checkBothTokenAmountInPool()
                            getLPTotalKEN()
                            getLPTotalCAY()
                        }}
                >
                    Check
                </button>
            </div>
        </div>
    )
        ;
};

const Pool = () => {
    const {
        getLPTotalCAY,
        getLPTotalKEN,
        lpKenBalance,
        lpCayBalance
    } = useContext(TransactionContext);

    return (
        <>
            <div className="pool-subCon">
                <div className="title">Liquidity</div>
                <div className="symbol">$-</div>
                <br/>
                <div className="coins-con">
                    <div className="coin-details">
                        <img src={tokenLogo} className="token_image select-none" id="to_token_img" alt=""/>
                        <div className="info">
                            {lpCayBalance}   CAY
                        </div>
                    </div>
                    <div className="coin-details">
                        <img src={ethLogo} className="token_image select-none" id="to_token_img" alt=""/>
                        <div className="info">
                            {lpKenBalance} KEN
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit"
                    className="bg-[#2952e3] py-2 px-7 float-right rounded-full cursor-pointer hover:bg-[#2546bd]"
                    id="swap_button"
                    onClick={() => {
                        getLPTotalKEN()
                        getLPTotalCAY()
                    }}
            >
                Check
            </button>

        </>
    );
};


const Withdraw = () => {
    const {
        getWithdrawToken,
        withdraw,
        lpKenBalance,
        lpCayBalance
    } = useContext(TransactionContext);

    const [values, setValues] = useState([10]);
    const {getTrackProps, handles} = useRanger({
        min: 1,
        max: 100,
        stepSize: 1,
        values,
        onChange: setValues
    });
    return (
        <div>
            <div className="withdraw_sub_con">
                <div>Amount</div>

                <div className="currentPercent">{values} %</div>
                <div
                    {...getTrackProps({
                        style: {
                            height: "4px",
                            background: "#ddd",
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
                            borderRadius: "2px"
                        }
                    })}
                >
                    {handles.map(({getHandleProps}) => (
                        <button
                            {...getHandleProps({
                                style: {
                                    width: "14px",
                                    height: "14px",
                                    outline: "none",
                                    borderRadius: "100%",
                                    background: "linear-gradient(to bottom, #eee 45%, #ddd 55%)",
                                    border: "solid 1px #888"
                                }
                            })}
                            onChange={(event) => {

                                console.log( event.target.value.toString())
                                console.log( values)
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="withdraw_sub_con">
                <div className="coin-details">
                    <img src={ethLogo} className="token_image select-none" id="to_token_img" alt=""/>
                    <div className="info">
                        Pooled KEN: {lpKenBalance*values/100}
                    </div>
                </div>
                <div className="coin-details">
                    <img src={tokenLogo} className="token_image select-none" id="to_token_img" alt=""/>
                    <div className="info">
                        Pooled CAY: {lpCayBalance*values/100}
                    </div>
                </div>
            </div>

            <button type="submit" className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                    id="swap_button"
                onClick={() => {
                    withdraw(values);
                    getWithdrawToken(values);
                }}
            >
                Withdraw
            </button>
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
                        {/* <div className="col col-md-10 offset-md-1 white-glassmorphism" id="window"> */}
                        <div className="selectTab">
                            <div
                                className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
                                onClick={() => changeTab("Swap")}
                            >
                                <h4 className="swapheader">Swap</h4>
                            </div>

                            <div
                                className={
                                    "tabStyle " + (activeTab === "AddLiquidity" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("AddLiquidity")}
                            >
                                <h4 className="swapheader">Provide</h4>

                            </div>

                            <div
                                className={
                                    "tabStyle " + (activeTab === "Pool" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("Pool")}
                            >
                                <h4 className="swapheader">Pool</h4>

                            </div>


                            <div
                                className={
                                    "tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("Withdraw")}
                            >
                                <h4 className="swapheader">Withdraw</h4>

                            </div>
                        </div>

                        <hr/>
                        {activeTab === "Swap" && (
                            <SwapItem tab="Swap"/>
                        )}
                        {activeTab === "AddLiquidity" && (
                            <AddLiquidity/>
                        )}
                        {activeTab === "Pool" && (
                            <Pool/>
                        )}
                        {activeTab === "Withdraw" && (
                            <Withdraw/>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
