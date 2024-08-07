<<<<<<< HEAD
import React from 'react'
import Navbar from '../../new-landing/Navbar'
import FirstPage from '../../new-landing/FirstPage'
import AboutUs from '../../new-landing/AboutUs'
import FooterTwo from '../../new-landing/FooterTwo'

const LandingController = () => {
    return (
        <div>
           <Navbar/>
           <FirstPage/>
           <AboutUs/>
           <FooterTwo/>
        </div>
    )
}
=======
import React from "react";
import NewFeature from "../../new-landing/NewFeatures";
import NewPricing from "../../new-landing/NewPricing";
import NewTestimonials from "../../new-landing/NewTestimonials";

const LandingController = () => {
  return (
    <>
      <NewFeature />
      <NewPricing />
      {/* <NewTestimonials /> */}
    </>
  );
};
>>>>>>> 0f92706 (added components)

export default LandingController;
