import React from 'react'

const About = () => {
    return (
        <>
            <section id="about" className="ud-about">
                <div className="container">
                    <div className="ud-about-wrapper wow fadeInUp" data-wow-delay=".2s">
                        <div className="ud-about-content-wrapper">
                            <div className="ud-about-content">
                                <span className="tag">About Us</span>
                                <h2>Empower Your Sales Team with EaseSFA: Your Partner in Streamlining Sales Force Automation</h2>
                                <p style={{ textAlign: 'justify' }}>
                                    At EaseSFA, we are passionate about empowering businesses with efficient sales force automation solutions. With a commitment to innovation and excellence, we strive to streamline sales reporting processes, enabling our clients to drive growth and achieve success in today's dynamic marketplace.
                                </p>

                                {/* <p>
                                    With a dedicated team of experts and a passion for innovation, EaseSFA is committed to providing cutting-edge solutions that transform the way businesses operate. We believe in the power of technology to simplify complex processes and empower organizations to achieve their goals. Backed by years of experience and a deep understanding of the sales industry, we strive to deliver unparalleled value to our clients through our commitment to excellence and customer satisfaction. Choose EaseSFA as your trusted partner in sales force automation, and discover the difference of effortless efficiency in your sales operations.
                                </p> */}
                                <a href="#" className="ud-main-btn">Learn More</a>
                            </div>
                        </div>
                        <div className="ud-about-image">
                            <img src="assets/images/about/about-image.svg" alt="about" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(About)