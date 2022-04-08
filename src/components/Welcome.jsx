import {SiEthereum} from "react-icons/si";
import {BsInfoCircle} from "react-icons/bs";
import  { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
    const { currentAccount, connectWallet} = useContext(TransactionContext);


    return (
        <div className="flex w-full justify-center items-center gradient-bg-welcome">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-2">
                       TARUC Blockchain <br/> Assignment
                    </h1>
                    <p className="text-left mt-2 text-white font-light md:w-9/12 w-11/12 text-base">
                       Below are the tools we using to developed the AMM based DEX platform system.
                    </p>


                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-7">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>Ganache</div>
                        <div className={companyCommonStyles}>Meta Mask</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>Remix</div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>Truffle</div>
                        <div className={companyCommonStyles}>React.js</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>Web3 & Ethers</div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10 pt-20">
                    <div
                        className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiEthereum fontSize={21} color="#fff"/>
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff"/>
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {currentAccount && (shortenAddress(currentAccount))}
                                    {!currentAccount && ("Address....")}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">
                                    Ethereum
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Welcome;
