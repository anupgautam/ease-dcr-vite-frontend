import React from 'react'

const Pricing = () => {
    return (
        <>
            <section id="pricing" className="ud-pricing">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ud-section-title mx-auto text-center">
                                <span>Pricing</span>
                                <h2>Our Pricing Plans</h2>
                                <p>
                                    Unlock the power of EaseSFA with transparent pricing tailored to your needs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row g-0 align-items-center justify-content-center">
                        <div className="col-lg-4 col-md-6 col-sm-10">
                            <div
                                className="ud-single-pricing first-item wow fadeInUp"
                                data-wow-delay=".15s"
                            >
                                <div className="ud-pricing-header">
                                    {/* <h3>BASIC</h3> */}
                                    <h4>Quarterly</h4>
                                </div>
                                <div className="ud-pricing-body">
                                    <ul>
                                        <li>Tour Plan</li>
                                        <li>Daily Calls Report</li>
                                        <li>Expense Management</li>
                                        <li>Sales Report</li>
                                        <li>Leave Application</li>
                                        <li>Missed Call</li>
                                        <li>Unplanned Tour</li>
                                        <li>Order Product</li>
                                        <li>Target</li>
                                        <li>Real time chat</li>
                                        <li>Real time notification</li>
                                        <li>24/7 Months support</li>
                                        {/* <li style={{ fontSize: '25px', color: "black", fontWeight: 'bold' }}>Rs. 1,500 /per user</li> */}
                                    </ul>
                                </div>
                                <div className="ud-pricing-footer">
                                    <a href="#" className="ud-main-btn ud-border-btn">
                                        Purchase Now
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-10">
                            <div
                                className="ud-single-pricing active wow fadeInUp"
                                data-wow-delay=".1s"
                            >
                                <span className="ud-popular-tag">Semi Yearly</span>
                                <div className="ud-pricing-header">
                                    {/* <h3>STANDARD</h3> */}
                                    <h4>Popular</h4>
                                </div>
                                <div className="ud-pricing-body">
                                    <ul>
                                        <li>Tour Plan</li>
                                        <li>Daily Calls Report</li>
                                        <li>Expense Management</li>
                                        <li>Sales Report</li>
                                        <li>Leave Application</li>
                                        <li>Missed Call</li>
                                        <li>Unplanned Tour</li>
                                        <li>Order Product</li>
                                        <li>Target</li>
                                        <li>Real time chat</li>
                                        <li>Real time notification</li>
                                        <li>24/7 Months support</li>
                                        {/* <li style={{ fontSize: '25px', color: "white", fontWeight: 'bold' }}>Rs. 2,800 /per user</li> */}
                                    </ul>
                                </div>
                                <div className="ud-pricing-footer">
                                    <a href="#" className="ud-main-btn ud-white-btn">
                                        Purchase Now
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-10">
                            <div
                                className="ud-single-pricing last-item wow fadeInUp"
                                data-wow-delay=".15s"
                            >
                                <div className="ud-pricing-header">
                                    {/* <h3>PREMIUM</h3> */}
                                    <h4>Yearly</h4>
                                </div>
                                <div className="ud-pricing-body">
                                    <ul>
                                        <li>Tour Plan</li>
                                        <li>Daily Calls Report</li>
                                        <li>Expense Management</li>
                                        <li>Sales Report</li>
                                        <li>Leave Application</li>
                                        <li>Missed Call</li>
                                        <li>Unplanned Tour</li>
                                        <li>Order Product</li>
                                        <li>Target</li>
                                        <li>Real time chat</li>
                                        <li>Real time notification</li>
                                        <li>24/7 Months support</li>
                                        {/* <li style={{ fontSize: '25px', color: "black", fontWeight: 'bold' }}>Rs. 5,500 /per user</li> */}
                                    </ul>
                                </div>
                                <div className="ud-pricing-footer">
                                    <a href="#" className="ud-main-btn ud-border-btn">
                                        Purchase Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(Pricing)