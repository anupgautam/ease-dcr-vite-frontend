import React from "react";
import Navbar from "../../new-landing/Navbar";
import FirstPage from "../../new-landing/FirstPage";
import AboutUs from "../../new-landing/AboutUs";
import FooterTwo from "../../new-landing/FooterTwo";
import NewFeatures from "../../new-landing/NewFeatures";
import NewPricing from "../../new-landing/NewPricing";
import NewTestimonials from "../../new-landing/NewTestimonials";
import Scrollnav from "../../new-landing/Scrollnav";
import Contact from "../../new-landing/Contact";

const LandingController = () => {
  return (
    <div>
      <Navbar />
      <Scrollnav/>
      <FirstPage />
      <NewFeatures />
      <AboutUs />
      <NewPricing />
      <NewTestimonials />
      <Contact/>
      <FooterTwo />
    </div>
  );
};

export default LandingController;
