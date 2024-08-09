import React, { useState } from "react";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import { useCreateLandingsMutation } from "../../api/MPOSlices/LandingSlice";
import {Grid,Box} from "@mui/material"

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
  const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
  const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
  const [errors, setErrors] = useState({});
  const validate = () => {
    let tempErrors = {};

    if (form.full_name.length < 4) {
      tempErrors.full_name = "Full Name must be at least 4 characters long.";
    }

    if (form.phone_number.length !== 10) {
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
      console.log("values:", form);
      const response = await createLandings(form).unwrap();
      console.log("rp:",response);
      
      try{
        if (response) {
          setSuccessMessage({ show: true, message: 'Successfully Message Sent' });
          setTimeout(() => {
              setSuccessMessage({ show: false, message: '' });
          }, 3000);
        }
        else{
          setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
          setTimeout(() => {
              setErrorMessage({ show: false, message: '' });
          }, 3000);
        }
       }
        catch(error){
          setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } 
    }
  };

  return (
    <div
      className="bg-[#f3f4fe] py-10 lg:py-24 font-public_sans relative"
      id="contact"
    >  
     
      {
                ErrorMessage.show === true ? (
                  <Grid>
                        <Box className=" z-50 bg-red-700 p-3 rounded-lg fixed right-5 top-24 w-fit ">
                            <h1 style={{ fontSize: '14px', color: 'white',zIndex:"999" }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className=" z-50 bg-emerald-500 p-3 rounded-lg fixed right-5 top-24 w-fit ">
                            <h1 style={{ fontSize: '14px', color: 'white',zIndex:"999" }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            
      <div className=" container lg:flex justify-between items-center">
        <div className=" lg:w-[55%]">
          <h3 className=" font-semibold text-sm">CONTACT US</h3>
          <h1 className=" text-[22px] lg:text-[34px] font-bold leading-tight my-2">
            Let's talk about
            <br /> Love to hear from you!
          </h1>
          <div className=" xl:flex justify-between my-1 lg:my-5 py-4 lg:py-8 space-y-3 xl:space-y-0 text-sm lg:text-[16px] xl:text-[18px] bg-white px-8 rounded-lg drop-shadow-md">
            <section className=" flex gap-x-3">
              <IoLocationSharp className=" text-[#6364f2] text-3xl mt-1" />
              <section className=" space-y-0.5">
                <h2 className=" font-semibold">Our Location</h2>
                <h3>Kalanki-14,Kathmandu,Nepal</h3>
              </section>
            </section>
            <section className=" flex gap-x-3">
              <IoMail className=" text-[#6364f2] text-3xl mt-1" />
              <section className=" space-y-0.5">
                <h2 className=" font-semibold">How Can We Help?</h2>
                <h3>info@easesfa.com</h3>
                <h3>contact@easesfa.com</h3>
              </section>
            </section>
          </div>
        </div>
        <div className=" lg:w-[55%] xl:w-[40%]">
          <section className=" px-5 lg:px-12 py-6 lg:py-12 bg-white rounded-xl drop-shadow-md">
            <h2 className=" font-bold text-[26px] pb-7">Send us a Message</h2>
            <form className="flex-col flex gap-y-5" onSubmit={handleSubmit}>
              <input
                placeholder="Full Name*"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className={`px-2 py-3 rounded-md border-2 ${
                  errors.full_name ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.full_name && (
                <span className="text-red-500 text-sm">{errors.full_name}</span>
              )}

              <input
                placeholder="Email*"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="px-2 py-3 rounded-md border-2 border-gray-200"
              />

              <input
                placeholder="Phone Number*"
                type="number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                className={`px-2 py-3 rounded-md border-2 ${
                  errors.phone_number ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.phone_number && (
                <span className="text-red-500 text-sm">{errors.phone_number}</span>
              )}

              <input
                placeholder="Message*"
                type="text"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className={`px-2 py-3 rounded-md border-2 ${
                  errors.message ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.message && (
                <span className="text-red-500 text-sm">{errors.message}</span>
              )}

              <button
                className="rounded-md bg-[#6364f2] p-3 text-white lg:w-[40%] xl:w-[45%]"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
      </div>
     
    </div>
  );
};

export default Contact;
