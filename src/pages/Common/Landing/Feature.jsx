import React from 'react'
import { Icon } from '@iconify/react';

const Feature = () => {
    return (
        <>
            <section id="features" className="ud-features">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ud-section-title">
                                <span>Features</span>
                                <h2>Features of Ease SFA</h2>
                                <p>
                                    There are many features in Ease SFA
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".1s">
                                <div className="ud-feature-icon">
                                    <Icon icon="material-symbols:data-table-outline" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">DCR</h3>
                                    <p className="ud-feature-desc">
                                        Daily Call Report
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".1s">
                                <div className="ud-feature-icon">
                                    <Icon icon="icon-park-solid:plan" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Tour Plan</h3>
                                    <p className="ud-feature-desc">
                                        Tour Plan
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".25s">
                                <div className="ud-feature-icon">
                                    <Icon icon="solar:dollar-bold" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Expenses</h3>
                                    <p className="ud-feature-desc">
                                        Users can set their goals and track their progress.
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".25s">
                                <div className="ud-feature-icon">
                                    <Icon icon="mingcute:target-line" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Targets</h3>
                                    <p className="ud-feature-desc">
                                        Users can set their goals and track their progress.
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".25s">
                                <div className="ud-feature-icon">
                                    <Icon icon="carbon:sales-ops" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Sales</h3>
                                    <p className="ud-feature-desc">
                                        Track your sales.
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".25s">
                                <div className="ud-feature-icon">
                                    <Icon icon="mdi:events" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Events</h3>
                                    <p className="ud-feature-desc">
                                        Track your events and calendar.
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".15s">
                                <div className="ud-feature-icon">
                                    <Icon icon="quill:chat" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Real Time Chat</h3>
                                    <p className="ud-feature-desc">
                                        Users can chat with
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-sm-6">
                            <div className="ud-single-feature wow fadeInUp" data-wow-delay=".2s">
                                <div className="ud-feature-icon">
                                    <Icon icon="iconamoon:notification-bold" style={{ fontSize: '40px' }} />
                                </div>
                                <div className="ud-feature-content">
                                    <h3 className="ud-feature-title">Real Time Notification</h3>
                                    <p className="ud-feature-desc">
                                        Leave approvals, chat notification are received at real time.
                                    </p>
                                    <a href="#" className="ud-feature-link">
                                        Learn More
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

export default React.memo(Feature)