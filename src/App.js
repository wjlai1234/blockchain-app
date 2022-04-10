import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Services, Footer,Welcome,Navbar} from "./components";
import Swap from "./components/Swap";
import SwapEth from "./components/SwapEth";
import ErrorBoundary from "./context/ErrorBoundary";
import React, {useContext} from "react";
import logo from "./images/logo.png";
import { TransactionContext } from "./context/TransactionContext";

// const NavBarItem = ({ title, classprops }) => (
//     <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
//   );

function App() {
    const { currentAccount, connectWallet} = useContext(TransactionContext);
    const [toggleMenu, setToggleMenu] = React.useState(false);

    return (
        <div className="min-h-screen">
            <div className="gradient-bg-welcome">
            <nav className="w-full flex md:justify-center  justify-between items-center pt-2 pb-2">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
            </div>
            <ul className="text-white md:flex hidden list-none pt-2 flex-row justify-between items-center flex-initial">
                <li className={`mx-4 cursor-pointer`}><a href="#wallet" className="navItem">Wallet</a></li>
                <li className={`mx-4 cursor-pointer`}><a href="#service" className="navItem">Details</a></li>
                <li className={`mx-4 cursor-pointer`}><a href="#swap" className="navItem">Swap</a></li>
                <li className={`mx-4 cursor-pointer`}><a href="#pool" className="navItem">Pool</a></li>

                {!currentAccount && (
                <li onClick={connectWallet} className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                Connect
                </li>)}
                {currentAccount && (
                <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full  select-none ">
                Connected
                </li>)}
            </ul>
            </nav>
                <ErrorBoundary id="wallet"><Welcome /></ErrorBoundary>
            </div>
            <div id="service"><Services /></div>
            <div id="swap"><SwapEth /></div>
            <div id="pool"><Swap /></div>
            
            <Footer/>
        </div>
    )
}

export default App;
