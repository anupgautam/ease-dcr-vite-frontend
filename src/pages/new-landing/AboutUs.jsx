import React from "react";

const AboutUs = () => {
  return (
    <div className=" bg-[rgb(243,244,254)] py-10 " id="about">
      <div className=" container ">
        <div className=" lg:flex justify-between bg-white rounded-lg">
        <div className=" lg:px-12 lg:py-8 px-4 py-3 lg:w-[45%]">
          <button className=" px-3 py-2 rounded-lg font-semibold text-xl">
            About Us
          </button>
          <h1 className=" text-[#3e3d48] font-semibold text-[27px] md:text-[38px] mt-4 mb-3 leading-tight">
            Empower Your Sales Team with EaseSFA:Your Partner in Streamlining
            Sales Force Automation
          </h1>
          <p className=" text-[#7c7ca1]">
            At EaseSFA, we are passionate about empowering businesses with
            efficient sales force automation solutions. With a commitment to
            innovation and excellence, we strive to streamline sales reporting
            processes, enabling our clients to drive growth and achieve success
            in today's dynamic marketplace.
          </p>
          <button className=" mt-7 p-3 bg-[#6364f2] text-white rounded-lg">
            Learn More
          </button>
        </div>
        <div className=" hidden lg:block">
          <img
            src="assets/images/about/about-image.svg"
            className=" h-[470px] xl:h-[530px] rounded-tr-lg" 
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
