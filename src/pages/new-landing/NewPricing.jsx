import { CheckCircle, Star } from "@material-ui/icons";
import { Diamond } from "@mui/icons-material";
import React from "react";

const icons = {
  Basic: <CheckCircle className="w-6 h-6 mr-2 text-[#66b3c5]" />,
  Premium: <Star className="w-6 h-6 mr-2 text-[#f38b23]" />,
  Enterprise: <Diamond className="w-6 h-6 mr-2 text-[#f15050]" />,
};

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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
            {/* Basic Plan */}
            <div className="bg-black rounded-2xl shadow-xl transform hover:scale-105 transition-transform relative">
              <div className="customRibbionWrapepr">
                <div className="customRibbon bg-[#66b3c5] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg">
                  {icons.Basic}
                </div>
              </div>
              <div className="p-8 text-white mt-4">
                <span className="text-[#66b3c5]">Basic</span>
                <h4 className="text-xl font-semibold">
                  $4.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <Tick />
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <Cross />
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <Cross />
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <Cross />
                    Order Product
                  </li>
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#1d383a] font-semibold rounded-full py-3 px-6 hover:bg-[#66b3c5] transition"
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
                <div className="customRibbon bg-[#f38b23] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg">
                  {icons.Premium}
                </div>
              </div>

              <div className="p-8 text-white mt-4">
                <span className="text-[#f38b23]">Premium</span>
                <h4 className="text-xl font-semibold">
                  $9.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <Tick />
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <Cross />
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <Cross />
                    Order Product
                  </li>
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#311a04] font-semibold rounded-full py-3 px-6 hover:bg-[#f38b23] transition"
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
                <div className="customRibbon bg-[#f15050] text-white text-sm font-semibold rounded-bl-lg flex items-center shadow-lg">
                  {icons.Enterprise}
                </div>
              </div>

              <div className="p-8 text-white mt-4">
                <span className="text-[#f15050]">Enterprise</span>
                <h4 className="text-xl font-semibold">
                  $15.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <Tick />
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <Tick />
                    Order Product
                  </li>
                </ul>
              </div>
              <div className="p-8 text-center">
                <a
                  href="#"
                  className="inline-block text-black bg-[#350c0e] font-semibold rounded-full py-3 px-6 hover:bg-[#f15050] transition"
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
