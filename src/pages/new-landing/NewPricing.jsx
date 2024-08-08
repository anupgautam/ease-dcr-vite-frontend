import { CheckCircle, Star, Diamond } from "@mui/icons-material";
import React from "react";

const features = [
  "Tour Plan",
  "Daily Calls Report",
  "Expense Management",
  "Sales Report",
  "Leave Application",
  "Missed Call",
  "Unplanned Tour",
  "Order Product",
  "Target",
  "Real time chat",
  "Real time notification",
  "24/7 Months support",
];

const NewPricing = () => {
  const Tick = () => (
    <svg
      className="w-4 h-4 text-green-500 mr-2.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
  );

  const Cross = () => (
    <svg
      className="w-4 h-4 text-red-500 mr-2.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  );

  return (
    <div>
      <section className="py-10">
        <div className="container">
          <div className="md:text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-800">
              Our Pricing Plans
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              Unlock the power of EaseSFA with transparent pricing tailored to
              your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Basic Plan */}
            <div className="bg-black rounded-2xl shadow-xl transform hover:scale-105 transition-transform relative">
              <div className="customRibbionWrapepr">
                <div className="customRibbon bg-[#66b3c5] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg"></div>
              </div>
              <div className="p-8 text-white mt-4 text-center">
                <span className="text-[#66b3c5] text-2xl font-bold uppercase ">
                  Quarterly
                </span>

                <ul className="mt-10 space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Tick />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#66b3c5] font-semibold rounded-full py-3 px-6"
                >
                  Order Now
                </a>
              </div>
              <div className="text-center text-gray-400 py-4">
                Free Trial 14 Days
              </div>
            </div>

            <div className="bg-black rounded-2xl shadow-xl transform hover:scale-105 transition-transform relative ">
              <div className="customRibbionWrapepr">
                <div className="customRibbon bg-[#f38b23] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg"></div>
              </div>
              {/* <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-8 py-1 p-8 rotate-90  uppercase font-public_sans">
                Popular
              </div> */}
              <div className="p-8 text-white mt-4 text-center">
                <span className="text-[#f38b23] text-2xl font-bold uppercase ">
                  Semi Yearly
                </span>
                <ul className="mt-10 space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center ">
                      <Tick />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#f38b23] font-semibold rounded-full py-3 px-6"
                >
                  Order Now
                </a>
              </div>
              <div className="text-center text-gray-400 py-4">
                Free Trial 14 Days
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-black rounded-2xl shadow-xl transform hover:scale-105 transition-transform relative ">
              <div className="customRibbionWrapepr">
                <div className="customRibbon bg-[#f15050] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg"></div>
              </div>

              <div className="p-8 text-white mt-4 text-center">
                <span className="text-[#f15050] text-2xl font-bold uppercase ">
                  Yearly
                </span>
                <ul className="mt-10 space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Tick />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#f15050] font-semibold rounded-full py-3 px-6 "
                >
                  Order Now
                </a>
              </div>
              <div className="text-center text-gray-400 py-4">
                Free Trial 14 Days
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewPricing;
