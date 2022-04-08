import ethLogo from "../images/eth-logo.png";
import tokenLogo from "../images/img.png";
import {useEffect, useState} from "react";

const SwapItem = (props) => {

    return (
        <div>
            <div id="form">
                { props.tab === "provide" &&
                (<h6 className="text-white"> The 0.03% charged per trade to PLs are fixed!</h6>)
                }
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="from_token_select">
                        <img src={ethLogo} className="token_image" id="from_token_img" alt=""/>
                        <span className="p-3" id="from_token_text">ETH</span>
                    </div>
                    <div className="swapbox_select">
                        <input className="number form-control" placeholder="amount" id="from_amount"/>
                    </div>
                </div>
                <div className="swapbox gradient-bg-welcome uk-card">
                    <div className="swapbox_select token_select" id="to_token_select">
                        <img src={tokenLogo} className="token_image " id="to_token_img" alt=""/>
                        <span className="p-3" id="to_token_text">TKB</span>
                    </div>
                    <div className="swapbox_select">
                        <input className="number form-control" placeholder="amount" id="to_amount"/>
                    </div>
                </div>
                <div className="pb-3">Estimated Gas: <span id="gas_estimate"></span></div>
                <button className="bg-[#2952e3] py-2 px-7  rounded-full cursor-pointer hover:bg-[#2546bd]"
                        id="swap_button">
                    Swap
                </button>
            </div>
        </div>
    );
};


const Swap = () => {
    const [activeTab, setActiveTab] = useState("Swap");
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
                                onClick={() => changeTab("Swap")}
                            >
                                <h4 className="swapheader">Swap</h4>
                            </div>
                            <div
                                className={
                                    "tabStyle " + (activeTab === "Provide" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("Provide")}
                            >
                                <h4 className="swapheader">Pool</h4>

                            </div>

                            <div
                                className={
                                    "tabStyle " + (activeTab === "Faucet" ? "activeTab" : "")
                                }
                                onClick={() => changeTab("Faucet")}
                            >
                                <h4 className="swapheader">Faucet</h4>

                            </div>

                        </div>

                        <hr/>
                        {activeTab === "Swap" && (
                            <SwapItem/>
                        )}
                        {activeTab === "Provide" && (
                            <SwapItem tab="provide"/>
                        )}

                        {activeTab === "Faucet" && (
                            <SwapItem tab="Faucet"/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default Swap;
