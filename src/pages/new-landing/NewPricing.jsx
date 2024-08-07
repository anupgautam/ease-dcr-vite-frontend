import React from "react";

const NewPricing = () => {
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
            <div className="bg-black rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform relative py-4">
              <div className="absolute top-0 right-0 bg-[#66b3c5] text-white text-sm font-semibold py-2 px-4 rounded-bl-lg flex items-center shadow-lg">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"></path>
                </svg>
              </div>
              <div className="p-8 text-white mt-4">
                <span className="text-[#66b3c5] ">Basic</span>
                <h4 className="text-xl font-semibold ">
                  $4.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
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

            <div className="bg-black rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform relative py-4">
              <div className="absolute top-0 right-0 bg-[#f38b23] text-white text-sm font-semibold py-2 px-4 rounded-bl-lg flex items-center shadow-lg ">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"></path>
                </svg>
              </div>

              <div className="p-8 text-white mt-4">
                <span className="text-[#f38b23] ">Premium</span>
                <h4 className="text-xl font-semibold ">
                  $9.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
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
            <div className="bg-black rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform relative py-4">
              <div className="absolute top-0 right-0 bg-[#f15050] text-white text-sm font-semibold py-2 px-4 rounded-bl-lg flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"></path>
                </svg>
              </div>
              <div className="p-8 text-white mt-4">
                <span className="text-[#f15050] ">Enterprise</span>
                <h4 className="text-xl font-semibold ">
                  $15.99<span className="text-sm">/month</span>
                </h4>
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Tour Plan
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Daily Calls Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Expense Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Sales Report
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Leave Application
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Missed Call
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    Unplanned Tour
                  </li>
                  <li className="flex items-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
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
