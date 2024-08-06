import React from 'react'

const Testimonials = () => {
    return (
        <>
            <section id="testimonials" className="ud-testimonials">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ud-section-title mx-auto text-center">
                                <span>Testimonials</span>
                                <h2>What our Customers Says</h2>
                                <p>
                                    There are many variations of passages of Lorem Ipsum available
                                    but the majority have suffered alteration in some form.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div
                                className="ud-single-testimonial wow fadeInUp"
                                data-wow-delay=".1s"
                            >
                                <div className="ud-testimonial-ratings">
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                </div>
                                <div className="ud-testimonial-content">
                                    <p>
                                        “Our members are so impressed. It's intuitive. It's clean.
                                        It's distraction free. If you're building a community.
                                    </p>
                                </div>
                                <div className="ud-testimonial-info">
                                    <div className="ud-testimonial-image">
                                        <img
                                            src="assets/images/testimonials/author-01.png"
                                            alt="author"
                                        />
                                    </div>
                                    <div className="ud-testimonial-meta">
                                        <h4>Sabo Masties</h4>
                                        <p>Founder @UIdeck</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div
                                className="ud-single-testimonial wow fadeInUp"
                                data-wow-delay=".15s"
                            >
                                <div className="ud-testimonial-ratings">
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                </div>
                                <div className="ud-testimonial-content">
                                    <p>
                                        “Our members are so impressed. It's intuitive. It's clean.
                                        It's distraction free. If you're building a community.
                                    </p>
                                </div>
                                <div className="ud-testimonial-info">
                                    <div className="ud-testimonial-image">
                                        <img
                                            src="assets/images/testimonials/author-02.png"
                                            alt="author"
                                        />
                                    </div>
                                    <div className="ud-testimonial-meta">
                                        <h4>Margin Gesmu</h4>
                                        <p>Founder @Lineicons</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div
                                className="ud-single-testimonial wow fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <div className="ud-testimonial-ratings">
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                    <i className="lni lni-star-filled"></i>
                                </div>
                                <div className="ud-testimonial-content">
                                    <p>
                                        “Our members are so impressed. It's intuitive. It's clean.
                                        It's distraction free. If you're building a community.
                                    </p>
                                </div>
                                <div className="ud-testimonial-info">
                                    <div className="ud-testimonial-image">
                                        <img
                                            src="assets/images/testimonials/author-03.png"
                                            alt="author"
                                        />
                                    </div>
                                    <div className="ud-testimonial-meta">
                                        <h4>William Smith</h4>
                                        <p>Founder @GrayGrids</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ud-brands wow fadeInUp" data-wow-delay=".2s">
                                <div className="ud-title">
                                    <h6>Trusted and Used by</h6>
                                </div>
                                {/* <div className="ud-brands-logo">
                                    <div className="ud-single-logo">
                                        <img src="assets/images/brands/ayroui.svg" alt="ayroui" />
                                    </div>
                                    <div className="ud-single-logo">
                                        <img src="assets/images/brands/uideck.svg" alt="uideck" />
                                    </div>
                                    <div className="ud-single-logo">
                                        <img
                                            src="assets/images/brands/graygrids.svg"
                                            alt="graygrids"
                                        />
                                    </div>
                                    <div className="ud-single-logo">
                                        <img
                                            src="assets/images/brands/lineicons.svg"
                                            alt="lineicons"
                                        />
                                    </div>
                                    <div className="ud-single-logo">
                                        <img
                                            src="assets/images/brands/ecommerce-html.svg"
                                            alt="ecommerce-html"
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(Testimonials)