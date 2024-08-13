import React from "react";
import logo from "/assets/ease.svg";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterTwo = () => {
  const medias = [
    {
      id: 0,
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/profile.php?id=61557314434333",
    },
    {
      id: 1,
      icon: <FaTwitter />,
    },
    {
      id: 3,
      icon: <RiInstagramFill />,
      href: "https://www.instagram.com/ease_sfa_/",
    },
    {
      id: 4,
      icon: <FaLinkedin />,
    },
  ];
  return (
    <div className="bg-blue-950 text-white">
      <section className=" relative z-0">
        <img
          src="assets/images/footer/shape-1.svg"
          alt="shape1"
          className=" absolute h-[280px] z-0"
        />
        <img
          src="assets/images/footer/shape-2.svg"
          alt="shape2"
          className=" absolute right-0 "
        />
        <img
          src="assets/images/footer/shape-3.svg"
          alt="shape3"
          className="hidden lg:block absolute right-0 top-0 h-[342px] z-0"
        />
      </section>
      <div className=" container grid lg:grid-cols-5 grid-cols-3  justify-between py-8 lg:py-16">
        <div className=" col-span-2 z-50">
          <section className="flex items-center">
            <img src={logo} alt="logo" className=" h-[3rem] lg:h-[4rem]" />
          </section>
          <p className=" text-gray-400 text-[14px] lg:text-[16px] mt-4">
            EaseSFA-Streaming Sales Force Automation
          </p>
          <div className=" flex gap-x-3 my-8">
            {medias.map((item) => {
              return (
                <h3
                  className=" text-white bg-[#161616] text-[20px] rounded-full p-3"
                  key={item.id}
                >
                  <a href={item.href}>{item.icon}</a>
                </h3>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className=" text-lg font-semibold">About us</h2>
          <ul className=" text-gray-400 mt-5 text-[16px]">
            <li>Home</li>
            <li>Features</li>
            <li>About</li>
            <li>Testimonial</li>
          </ul>
        </div>
        <div>
          <h2 className=" text-lg font-semibold">Features</h2>
          <ul className=" text-gray-400 mt-5 text-[16px]">
            <li>How it works</li>
            <li>Privacy</li>
            <li>Terms of services</li>
          </ul>
        </div>
        <div className=" col-span-2 lg:col-span-1 z-50 mx-auto lg:mx-0">
          <h2 className=" text-lg font-semibold">Download Now</h2>
          <Link to="*">
            <img
              src="/assets/google-play-store.png"
              className=" h-16 lg:h-20 mt-7"
            />
          </Link>
          <Link to="*">
            <img src="/assets/app-store.png" className=" h-16 lg:h-20 z-50" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterTwo;
