import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-welcome gradient-bg-services">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
          Auto Market Maker based
          <br />
         Decentralized Finance(DEX)
        </h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
          We are developed Automated Market Maker based Decentralised Financial platform system by using technology beside.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#2952E3]"
          title="AMM Technology"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="We are adopted XYK Model of Liquidity pools to provide user a peer-to-contract transaction.     "
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="The Top World of Dex Platform"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Liquidity Provider (PLs)"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="We are providing the liquidity provider 0.3% interest will be in charged per every trade occur."
        />
      </div>
    </div>
  </div>
);

export default Services;
