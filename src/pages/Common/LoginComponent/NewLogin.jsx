import React from "react";
import LoginForm from "./LoginForm";
import loginImg from "/assets/images/EASE_SFA/ease.svg";
//New login page layout made by shirish

const NewLogin = () => {
  return (
    <div className=" bg-neutral-200 h-screen font-public_sans">
      <div className=" lg:flex py-[1rem] lg:py-[3rem] xl:px-[10rem] lg:px-[6rem] px-[1rem] h-full rounded-3xl drop-shadow-lg ">
        <div
          className=" hidden bg-cover bg-no-repeat bg-center lg:flex items-end w-[50%] py-16 px-28 rounded-tl-3xl rounded-bl-3xl text-center"
          style={{ backgroundImage: `url(${loginImg})` }}
        >
          <section className=" text-white">
            <h1 className=" font-bold text-3xl">Ease SFA</h1>
            <p className="mt-1.5">
              {" "}
              Cupidatat nisi officia nostrud nostrud veniam proident sit anim
              minim officia. Pariatur fugiat et voluptate ea.
            </p>
          </section>
        </div>

        <div className=" w-full mx-auto lg:mx-0 lg:w-[50%] p-3 xl:p-24 md:p-14 lg:p-14 bg-white lg:rounded-tr-3xl lg:rounded-br-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
