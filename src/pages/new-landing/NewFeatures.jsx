import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faRoute,
  faDollarSign,
  faBullseye,
  faChartLine,
  faCalendarAlt,
  faComments,
  faBell,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import "tailwindcss/tailwind.css";

const services = [
  {
    icon: faTable,
    title: "DCR",
    description:
      "The Daily Call Report (DCR) helps you maintain a log of all your daily calls",
    bgColor: "bg-blue-500",
  },
  {
    icon: faRoute,
    title: "Tour Plan",
    description:
      "Plan your tours efficiently with our comprehensive Tour Plan feature",
    bgColor: "bg-green-500",
  },
  {
    icon: faCogs,
    title: "POB",
    description:
      "Personal Order Booking (POB)  enables sales reps to quickly place customer orders on the spot, ensuring accurate, real-time processing.",
    bgColor: "bg-orange-900",
  },
  {
    icon: faDollarSign,
    title: "Expenses",
    description: "Keep track of all your expenses with ease",
    bgColor: "bg-yellow-500",
  },
  {
    icon: faBullseye,
    title: "Targets",
    description: "Set and track your goals with the Targets feature",
    bgColor: "bg-red-500",
  },
  {
    icon: faChartLine,
    title: "Sales",
    description:
      "Track your sales activities and performance with our Sales feature",
    bgColor: "bg-purple-500",
  },
  {
    icon: faCalendarAlt,
    title: "Events",
    description: "Stay on top of your schedule with our Events feature.",
    bgColor: "bg-teal-500",
  },
  {
    icon: faComments,
    title: "Real Time Chat",
    description: "Enhance communication with our Real Time Chat feature.",
    bgColor: "bg-pink-500",
  },
  {
    icon: faBell,
    title: "Real Time Notification",
    description:
      "Receive real-time notifications to stay updated on important events and activities",
    bgColor: "bg-orange-500",
  },
];

const NewFeature = () => {
  return (
    <div className="py-10">
      <div className="container mx-auto">
        <div className="md:text-center font-public_sans">
          <h1 className="text-[28px] md:text-[38px] font-bold mt-2 text-[#3e3d48]">
            Features of Ease SFA
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            All our features are the best in Sales Management to date,
            <br />
            learn now to be more confident
          </p>
        </div>

        <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-between gap-6 mt-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="card items-center p-4 shadow-lg cursor-default "
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${service.bgColor} mb-4`}
              >
                <FontAwesomeIcon
                  icon={service.icon}
                  className="text-white text-3xl"
                />
              </div>
              <div className=" card-content text-center">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewFeature;
