import React from "react";
import logo from "/assets/logo.png";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";

const FooterTwo = () => {
  const medias = [
    {
      id: 0,
      icon: <FaFacebookF />,
    },
    {
      id: 1,
      icon: <FaTwitter />,
    },
    {
      id: 3,
      icon: <RiInstagramFill />,
    },
    {
      id: 4,
      icon: <FaLinkedin />,
    },
  ];
  return (
    <div className="bg-[#000000] text-white">
     <section className=" relative z-0">
        <img src="assets/images/footer/shape-1.svg" alt="shape1" className=" absolute h-[280px] z-0"/>
        <img src="assets/images/footer/shape-2.svg" alt="shape2" className=" absolute right-0 "/>
        <img src="assets/images/footer/shape-3.svg" alt="shape3" className=" absolute right-0 top-0 h-[342px] z-0"/>
     </section>
      <div className=" container grid lg:grid-cols-5 grid-cols-3  justify-between py-8 lg:py-16">
        <div className=" col-span-2 z-50">
          <section className="flex items-center">
            <img src={logo} alt="logo" className=" h-16" />
            <h2 className=" font-semibold">Ease SFA</h2>
          </section>
          <p className=" text-[#797979] text-[16px] mt-4">
            EaseSFA-Streaming Sales Force Automation
          </p>
          <h2 className=" flex gap-x-3 my-8">
            {medias.map((item) => {
              return (
                <h2
                  className=" text-white bg-[#161616] text-[20px] rounded-full p-3"
                  key={item.id}
                >
                  {item.icon}
                </h2>
              );
            })}
          </h2>
        </div>
        <div>
          <h2 className=" text-lg font-semibold">About us</h2>
          <ul className=" text-[#797979] mt-5 text-[16px]">
            <li>Home</li>
            <li>Features</li>
            <li>About</li>
            <li>Testimonial</li>
          </ul>
        </div>
        <div>
          <h2 className=" text-lg font-semibold">Features</h2>
          <ul className=" text-[#797979] mt-5 text-[16px]">
            <li>How it works</li>
            <li>Privacy</li>
            <li>Terms of services</li>
          </ul>
        </div>
        <div className=" col-span-2 lg:col-span-1 z-50">
          <h2 className=" text-lg font-semibold">Download Now</h2>
          <img src="/assets/google-play-store.png" className=" h-16 lg:h-20 mt-7" />
          <img src="/assets/app-store.png" className=" h-16 lg:h-20 z-50" />
        </div>
      </div>
    </div>
  );
};

export default FooterTwo;
