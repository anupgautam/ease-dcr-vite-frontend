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

export default LandingController