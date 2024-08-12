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
  "Real-time chat",
  "Real-time notification",
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

  return (
    <div>
      <section className="py-10">
        <div className="container">
          <div className="md:text-center mb-12">
            <h2 className="text-[28px] md:text-[38px] font-bold mt-2 text-[#3e3d48]">
              Our Pricing Plans
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              Unlock the power of EaseSFA with transparent pricing tailored to
              your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            <div className="CustomWrapper rounded-2xl shadow-xl transform hover:scale-105 text-balck  overflow-hidden transition-transform relative ">
              <div className="p-8 mt-4 text-center">
                <span className="text-[#6364f2] text-2xl font-bold uppercase">
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
                  className="inline-block text-white bg-[#6364f2] hover:scale-105 duration-300  font-semibold rounded-full py-3 px-6"
                >
                  Order Now
                </a>
              </div>
              <div className="text-center text-gray-400 ">
                Free Trial 14 Days
              </div>
            </div>

            <div className="rounded-2xl shadow-xl transform scale-105 hover:scale-110 bg-[#6364f2] text-white  transition-transform relative">
              <div className="absolute -top-6 right-2 mt-4 mr-4 bg-yellow-400 text-xs text-gray-800 font-semibold py-1 px-4 rounded-full uppercase">
                Popular
              </div>
              <div className="p-8 mt-4 text-center">
                <span className="text-2xl font-bold uppercase">
                  Semi Yearly
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
                  className="inline-block text-black bg-[#fff] hover:bg-[#5b21b6] hover:text-white font-semibold rounded-full py-3 px-6"
                >
                  Order Now
                </a>
              </div>
              <div className="text-center text-gray-400 py-4">
                Free Trial 14 Days
              </div>
            </div>

            <div className="CustomWrapper rounded-2xl shadow-xl transform hover:scale-105  overflow-hidden transition-transform relative">
              <div className="p-8 mt-4 text-center">
                <span className="text-[#6364f2] text-2xl font-bold uppercase">
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
                  className="inline-block text-white bg-[#6364f2] hover:scale-105 duration-300 font-semibold rounded-full py-3 px-6"
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
