import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="ud-footer wow fadeInUp" data-wow-delay=".15s">
        <div className="shape shape-1">
          <img src="assets/images/footer/shape-1.svg" alt="shape" />
        </div>
        <div className="shape shape-2">
          <img src="assets/images/footer/shape-2.svg" alt="shape" />
        </div>
        <div className="shape shape-3">
          <img src="assets/images/footer/shape-3.svg" alt="shape" />
        </div>
        <div className="ud-footer-widgets">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="ud-widget">
                  <a
                    href="index.html"
                    style={{ display: "flex" }}
                    className="ud-footer-logo"
                  >
                    <img
                      src="assets/logo.png"
                      className="image-design-data"
                      alt="Logo"
                    />
                    <p
                      style={{
                        marginTop: "15px",
                        fontSize: "18px",
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "10px",
                      }}
                    >
                      Ease SFA
                    </p>
                  </a>
                  <p className="ud-widget-desc">
                    EaseSFA - Streamlining Sales Force Automation
                  </p>
                  <ul className="ud-widget-socials">
                    <li>
                      <a href="https://twitter.com/MusharofChy">
                        <i className="lni lni-facebook-filled"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/MusharofChy">
                        <i className="lni lni-twitter-filled"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/MusharofChy">
                        <i className="lni lni-instagram-filled"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/MusharofChy">
                        <i className="lni lni-linkedin-original"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6">
                <div className="ud-widget">
                  <h5 className="ud-widget-title">About Us</h5>
                  <ul className="ud-widget-links">
                    <li>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">Features</a>
                    </li>
                    <li>
                      <a href="#">About</a>
                    </li>
                    <li>
                      <a href="#">Testimonial</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6">
                <div className="ud-widget">
                  <h5 className="ud-widget-title">Features</h5>
                  <ul className="ud-widget-links">
                    <li>
                      <a href="#">How it works</a>
                    </li>
                    <li>
                      <a href="#">Privacy policy</a>
                    </li>
                    <li>
                      <a href="#">Terms of service</a>
                    </li>
                    {/* <li>
                                            <a href="#">Refund policy</a>
                                        </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-8 col-sm-10">
                <div className="ud-widget">
                  <h5 className="ud-widget-title">Clients</h5>
                  <ul className="ud-widget-brands">
                    {/* <li>
                                            <a
                                                href="https://ayroui.com/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/ayroui.svg"
                                                    alt="ayroui"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://ecommercehtml.com/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/ecommerce-html.svg"
                                                    alt="ecommerce-html"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://graygrids.com/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/graygrids.svg"
                                                    alt="graygrids"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://lineicons.com/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/lineicons.svg"
                                                    alt="lineicons"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://uideck.com/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/uideck.svg"
                                                    alt="uideck"
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://tailwindtemplates.co/"
                                                rel="nofollow noopner"
                                                target="_blank"
                                            >
                                                <img
                                                    src="assets/images/footer/brands/tailwindtemplates.svg"
                                                    alt="tailwindtemplates"
                                                />
                                            </a>
                                        </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6">
                <div className="ud-widget">
                  <h5 className="ud-widget-title">Download Now</h5>
                  <ul className="ud-widget-links">
                    <li>
                      <a href="#" rel="nofollow noopner" target="_blank">
                        <img
                          src="assets/google-play-store.png"
                          alt="tailwindtemplates"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#" rel="nofollow noopner" target="_blank">
                        <img
                          src="assets/app-store.png"
                          alt="tailwindtemplates"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ud-footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <ul className="ud-footer-bottom-left">
                  <li>
                    <a href="#">Privacy policy</a>
                  </li>
                  <li>
                    <a href="#">Support policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of service</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <p
                  className="ud-footer-bottom-right"
                  style={{ marginRight: "6px" }}
                >
                  Designed and Developed by
                  <a
                    href="https://thinkfortech.com/"
                    rel="nofollow"
                    style={{
                      marginLeft: "4px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Think 4 Tech
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a href="#" className="back-to-top">
        <i className="lni lni-chevron-up"> </i>
      </a>
    </>
  );
};

export default React.memo(Footer);
