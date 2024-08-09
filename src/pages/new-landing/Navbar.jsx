import React from "react";
import logo from "/assets/logo.png";
import { Link, Events, scrollSpy } from "react-scroll";
import "./Navbar.css";
import { navItems } from "./Elements";

const Navbar = () => {

  return (
    <div className=" container cursor-pointer">
      <div className=" font-public_sans flex items-center justify-between py-2.5 font-semibold lg:font-bold">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 md:h-14" />
          <p className="hidden md:block text-[19px]">Ease SFA</p>
        </div>
        <div className="flex gap-x-2.5 lg:gap-x-8 text-xl">
          {navItems.map((item, idx) => (
            <Link
              to={item.path}
              smooth={true}
              spy={true}
              offset={-100}
              duration={800}
              key={idx}
              activeClass="active-path"
            >
              <h2 className=" py-1.5 lg:py-3 text-[9.5px] sm:text-[11px] md:text-sm lg:text-[19px] hover:translate-y-1 duration-500 ">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
        <button className="bg-[#6364f2] px-2 py-1.5 lg:px-5 lg:py-2.5 rounded-[30px] text-[10px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Navbar;
