import React from "react";
import logo from "/assets/ease.svg";
import { Link as ScrollLink, Events, scrollSpy } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import "./Navbar.css";
import Cookies from 'js-cookie'
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user_role } = useSelector((state) => state.cookie);

  const login = user_role;
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
    <div className=" container cursor-pointer">
      <div className=" font-public_sans flex items-center justify-between font-semibold lg:font-bold">
        <img src={logo} alt="logo" className="  h-16 lg:h-20" />
        <div className="flex gap-x-2.5 md:gap-x-8 text-xl">
          {navItems.map((item, idx) => (
            <ScrollLink
              to={item.path}
              smooth={true}
              spy={true}
              offset={-100}
              duration={800}
              key={idx}
              activeClass="active-path"
            >
              <h2 className="py-3 text-[11px] md:text-[16px] ">
                {item.title}
              </h2>
            </ScrollLink>
          ))}
        </div>
        {login ? (
          <RouterLink
            to={
              user_role === "admin" ?
                "/dashboard/admin"
                : "/dashboard/admin/listofdoctor"
            }
            className="ud-main-btn ud-white-btn"
          >
            <button className="bg-[#6364f2] p-2  px-4 md:px-8  rounded-[30px] text-[9px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
              Go to Dashboard
            </button>
          </RouterLink>
        ) : (
          <RouterLink to="/login" className="ud-main-btn ud-white-btn">
            <button className="bg-[#6364f2] p-2 px-4 md:px-8 rounded-[30px] text-[9px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
              Login
            </button>
          </RouterLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
