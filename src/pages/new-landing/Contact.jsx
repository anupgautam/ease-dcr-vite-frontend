import React, { useState } from "react";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import { useCreateLandingsMutation } from "../../api/MPOSlices/LandingSlice";
import { Grid, Box } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import logo from "/assets/logo.png";
import deskImg from "/assets/desk.jpg";

const Contact = () => {
  const [createLandings] = useCreateLandingsMutation();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const [SuccessMessage, setSuccessMessage] = useState({
    show: false,
    message: "",
  });
  const [ErrorMessage, setErrorMessage] = useState({
    show: false,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    let tempErrors = {};

    if (form.full_name.length < 4) {
      tempErrors.full_name = "Full Name must be at least 4 characters long.";
    }

    if (form.phone_number.length !== 13) {
      tempErrors.phone_number = "Phone Number must be exactly 10 digits.";
    }

    if (form.message.length < 10) {
      tempErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await createLandings(form).unwrap();
      try {
        if (response) {
          setSuccessMessage({
            show: true,
            message: "Successfully Message Sent",
          });
          setTimeout(() => {
            setSuccessMessage({ show: false, message: "" });
          }, 3000);
        } else {
          setErrorMessage({
            show: true,
            message: "Some Error Occurred. Try again later",
          });
          setTimeout(() => {
            setErrorMessage({ show: false, message: "" });
          }, 3000);
        }
      } catch (error) {
        setErrorMessage({
          show: true,
          message: "Some Error Occurred. Try again later",
        });
        setTimeout(() => {
          setErrorMessage({ show: false, message: "" });
        }, 3000);
      }
      
    }
  };

  return (
    <div
      className=" py-10 lg:py-24 font-public_sans relative container"
      id="contact"
    >
      {ErrorMessage.show === true ? (
        <Grid>
          <Box className=" z-50 bg-red-700 p-3 rounded-lg fixed right-5 top-24 w-fit ">
            <h1 style={{ fontSize: "14px", color: "white", zIndex: "999" }}>
              {ErrorMessage.message}
            </h1>
          </Box>
        </Grid>
      ) : null}
      {SuccessMessage.show === true ? (
        <Grid>
          <Box className=" z-50 bg-emerald-500 p-3 rounded-lg fixed right-5 top-24 w-fit ">
            <h1 style={{ fontSize: "14px", color: "white", zIndex: "999" }}>
              {SuccessMessage.message}
            </h1>
          </Box>
        </Grid>
      ) : null}

      <div className=" lg:flex justify-between bg-white rounded-[15px] p-3 shadow-lg drop-shadow-md">
        <div className=" xl:w-[37%]">
          <section className=" px-5 lg:px-12 py-3 lg:py-12">
            <h2 className=" font-bold text-[30px] pb-2">Send us a Message</h2>
            <p className=" pb-7 text-[#7c8285]">
              Need help with something? Want a demo? Get in touch with our
              friendly team and we'll get in touch within a day.
            </p>
            <form className="flex-col flex gap-y-5" onSubmit={handleSubmit}>
              <input
                placeholder="Full Name *"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className={`px-2 py-3  border-b-2 ${
                  errors.full_name ? "border-b-red-600" : "border-b-gray-200"
                }`}
              />
              {errors.full_name && (
                <span className="text-red-600 text-sm">{errors.full_name}</span>
              )}

              <input
                placeholder="Email *"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="px-2 py-3  border-b-2 border-gray-200"
              />

              <PhoneInput buttonStyle={{border:"none",background:"white",paddingBottom:"12px"}}
                country={"np"} // Set default country
                value={form.phone_number}
                defaultMask=".........."
                onChange={(phone) =>
                  handleChange({
                    target: { name: "phone_number", value: phone },
                  })
                }
                inputStyle={{border: "none"}}
                inputClass=" font-public_sans"
                placeholder="Phone Number *"
                required
                className={`${errors.phone_number ?"border-red-600":"border-gray-200"} border-b-2 px-2 font-public_sans pb-3`}
               
              />
              {errors.phone_number && (
                <span className="border-b-red-600 text-red-600 text-sm">
                  {errors.phone_number}
                </span>
              )}

              <input
                placeholder="Message *"
                type="text"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className={`px-2 py-3  border-b-2 ${
                  errors.message ? "border-b-red-600" : "border-gray-200"
                }`}
              />
              {errors.message && (
                <span className="text-red-600 text-sm">{errors.message}</span>
              )}

              <button
                className=" bg-[#6364f2] p-3 text-white mt-4 rounded-xl"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
        <div className="relative xl:flex-1 px-5 lg:px-12 py-6 lg:py-12 rounded-[15px] drop-shadow-md">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat rounded-[15px] contrast-75 brightness-50"
            style={{
              backgroundImage: `url(${deskImg})`,
            }}
          />
          <section className="flex gap-x-1 items-center absolute right-3 top-2 text-gray-200">
            <img src={logo} alt="logo" className="h-12" />
            <h3 className="font-bold">Ease SFA</h3>
          </section>

          {/* Content Layer */}
          <div className="relative z-10 h-full">
            <div className="xl:flex justify-between h-full text-white">
              <div className="content-end text-white ">
                <h3 className="font-semibold text-sm">CONTACT US</h3>
                <h1 className="text-[20px] lg:text-[30px] font-bold leading-tight my-2">
                  Let's talk about
                  <br /> Love to hear from you!
                </h1>
              </div>
              <div className="space-y-8 text-sm lg:text-[16px] xl:text-[18px] content-end xl:mt-0 mt-10">
                <section className="flex gap-x-3 hover:translate-x-4 duration-300">
                  <IoLocationSharp className="text-[#6364f2] text-2xl" />
                  <section className="space-y-2">
                    <h2 className="font-bold text-[20px] mb-3">Our Location</h2>
                    <h3 className="text-[18px]">
                      Kalanki-14, Kathmandu, Nepal
                    </h3>
                  </section>
                </section>
                <section className="flex gap-x-3 hover:translate-x-4 duration-300">
                  <IoMail className="text-[#6364f2] text-2xl" />
                  <section className="space-y-2 text-[20px]">
                    <h2 className="font-bold text-[20px] mb-3">
                      How Can We Help?
                    </h2>
                    <h3>info@easesfa.com</h3>
                    <h3>contact@easesfa.com</h3>
                  </section>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
