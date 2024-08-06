import React from 'react'

const Hero = () => {
    return (
        <>
            <section className="ud-hero" id="home">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ud-hero-content wow fadeInUp" data-wow-delay=".2s">
                                <h1 className="ud-hero-title">
                                    EaseSFA - Streamlining Sales Force Automation
                                </h1>
                                <p className="ud-hero-desc">
                                    EaseSFA provides cutting-edge sales force automation solutions, revolutionizing the way businesses manage and optimize their sales reporting processes. Simplify your sales operations and enhance productivity with our intuitive platform.
                                </p>
                                <ul className="ud-hero-buttons">
                                    <li>
                                        <a href="#" rel="nofollow noopener" target="_blank" className="ud-main-btn ud-white-btn">
                                            Book a Demo
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" rel="nofollow noopener" target="_blank" className="ud-main-btn ud-link-btn">
                                            About Us <i className="lni lni-arrow-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="ud-hero-brands-wrapper wow fadeInUp"
                                data-wow-delay=".3s"
                            >
                                {/* <img src="assets/images/hero/brand.svg" alt="brand" /> */}
                            </div>
                            <div className="ud-hero-image wow fadeInUp" data-wow-delay=".25s">
                                <div className="image-container">
                                    <img src="assets/images/EASE_SFA/LaptopFrame.webp" alt="laptopdashboard-image" />
                                    <img src="assets/images/EASE_SFA/mobile.webp" alt="DCRApp-image" />
                                </div>
                            </div>
                            <img
                                src="assets/images/hero/dotted-shape.svg"
                                alt="shape"
                                className="shape shape-1"
                            />
                            <img
                                src="assets/images/hero/dotted-shape.svg"
                                alt="shape"
                                className="shape shape-2 "
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(Hero)