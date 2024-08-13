import { useEffect, useState } from "react";
import { Link as ScrollLink, Events, scrollSpy } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import logo from "/assets/ease.svg";
import "./Scrollnav.css";
import { navItems } from "./Elements";
import Cookies from "js-cookie";

const Scrollnav = () => {
  const login = Cookies.get("user_role");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let scrollYThreshold;
      if (window.innerWidth <= 640) {
        scrollYThreshold = 12; // Adjust threshold for small screens
      } else {
        scrollYThreshold = 100; // Default threshold for medium & above screens
      }
      // Add logic for handling scroll based on the threshold
      if (window.scrollY > scrollYThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 lg:h-24 bg-white transition-transform duration-300 flex items-center ease-in-out z-50 drop-shadow-md ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div className=" flex font-semibold gap-x-2 lg:gap-x-2 md:gap-x-6 items-center container justify-between py-3">
        <img src={logo} alt="LOGO" className="h-[40px] md:h-14 lg:h-20" />

        <div className=" flex gap-[1rem] md:gap-[2rem] lg:gap-[3rem] font-bold">
          {navItems.map((item, idx) => {
            return (
              <ScrollLink
                to={item.path}
                smooth={true}
                spy={true}
                offset={-100}
                duration={800}
                key={idx}
                activeClass="active-link"
              >
                <h1 className=" font-public_sans text-[11px] md:text-[16px] py-2 hover:translate-y-1 duration-500 cursor-pointer">
                  {item.title}
                </h1>
              </ScrollLink>
            );
          })}
        </div>
        {/* <button className="bg-[#6364f2] px-2 py-1.5 lg:px-5 lg:py-2.5 rounded-[30px] text-[9px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
          Go to Dashboard
        </button> */}
        {login ? (
          <button className="bg-[#6364f2] px-4 md:px-8  py-1.5  lg:py-2.5 rounded-[30px] text-[9px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
            <RouterLink
              to={
                Cookies.get("user_role") === "admin"
                  ? "/dashboard/admin"
                  : "/dashboard/admin/listofdoctor"
              }
              className="ud-main-btn ud-white-btn"
            >
              Go to Dashboard
            </RouterLink>
          </button>
        ) : (
          <button className="bg-[#6364f2] px-4 md:px-[2rem] py-1.5  lg:py-2.5 rounded-[30px] text-[9px] md:text-[18px] text-white hover:scale-105 hover:bg-violet-800 duration-300">
            <RouterLink to="/login" className="ud-main-btn ud-white-btn">
              Login
            </RouterLink>
          </button>
        )}
      </div>
    </header>
  );
};

export default Scrollnav;
