import React from "react";
import logo from "/assets/logo.png";
import { Link, Events, scrollSpy } from "react-scroll";
import "./Navbar.css";

const Navbar = () => {
  const navItems = [
    {
      id: 0,
      title: "Home",
      path: "home",
    },
    {
      id: 1,
      title: "About",
      path: "about",
    },
    {
      id: 2,
      title: "Book a Demo",
      path: "demo",
    },
    {
      id: 3,
      title: "Contact",
      path: "contact",
    },
  ];

  return (
    <div className="bg-[#ffffff] fixed w-full top-0 z-50 left-0 right-0 drop-shadow-md">
      <div className="font-public_sans flex items-center container justify-between py-3 font-semibold">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 md:h-14" />
          <p className="hidden md:block text-[21px]">Ease SFA</p>
        </div>
        <div className="flex gap-x-2.5 lg:gap-x-8 text-xl">
          {navItems.map((item,idx) => (
            <Link
              to={item.path}
              smooth={true}
              spy={true}
              offset={-100}
              duration={800}
              key={idx}
              activeClass="active-link"
            >
             <h2 className="py-3 text-[11px] md:text-sm lg:text-[23px] ">{item.title}</h2>
            </Link>
          ))}
        </div>
        <button className="bg-[#6364f2] p-2 lg:p-3 rounded-lg text-[11px] md:text-xl text-white">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Navbar;
