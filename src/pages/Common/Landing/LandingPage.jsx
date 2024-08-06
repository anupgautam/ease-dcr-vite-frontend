import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Feature from './Feature'
import About from './About'
import Pricing from './Pricing'
import FAQ from './FAQ'
import Testimonials from './Testimonials'
// import Teams from './Teams'
import Contact from './Contact'
import Footer from './Footer'
// import '../../../styles/bootstrap.min.css'
// import '../../../styles/lineicons.css'
// import '../../../styles/animate.css'
// import '../../../styles/ud-styles.css'
// import '../../../styles/ud-styles.css.map'

const LandingPage = () => {
    return (
        <>
            <Header />
            <Hero />
            <Feature />
            <About />
            <Pricing />
            <FAQ />
            <Testimonials />
            {/* <Teams /> */}
            <Contact />
            <Footer />
        </>
    )
}

export default React.memo(LandingPage)