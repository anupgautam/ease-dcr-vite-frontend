import React from "react";
import Navbar from "../../new-landing/Navbar";
import FirstPage from "../../new-landing/FirstPage";
import AboutUs from "../../new-landing/AboutUs";
import FooterTwo from "../../new-landing/FooterTwo";
import NewFeature from "../../new-landing/NewFeatures";
import NewPricing from "../../new-landing/NewPricing";
import NewTestimonials from "../../new-landing/NewTestimonials";

const LandingController = () => {
  return (
    <div>
      <Navbar />
      <FirstPage />
      <NewFeature />
      <AboutUs />
      <NewPricing />
      <FooterTwo />
      {/* <NewTestimonials /> */}
    </div>
  );
};

export default LandingController;
