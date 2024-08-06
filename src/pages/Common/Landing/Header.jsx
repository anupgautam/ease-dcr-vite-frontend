import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "../../../styles/bootstrap.min.css"
import "../../../styles/lineicons.css"
import "../../../styles/animate.css"
import "../../../styles/ud-styles.css"
import "../../../styles/ud-styles.css.map"
import Cookies from 'js-cookie';
import { Grid } from '@mui/material';
// import "../../../styles/boxicons.css"

const Header = () => {
    const [Show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!Show);
    }
    const login = Cookies.get('user_role');
    return (
        <>
            <header className="ud-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-md navbar-expand-lg">
                                <a className="navbar-brand" style={{ display: 'flex' }} href="/">
                                    <img src="assets/logo.png" className='image-design-data' alt="Logo" />
                                    <p style={{ marginTop: '15px', fontSize: '18px', color: "white", fontWeight: 'bold', marginLeft: '10px' }}>Ease SFA</p>
                                </a>
                                <button className="navbar-toggler display-icons" onClick={handleShow}>
                                    <span className="toggler-icon"> </span>
                                    <span className="toggler-icon"> </span>
                                    <span className="toggler-icon"> </span>
                                </button>
                                {
                                    Show === true ?
                                        <div className="nav-bar-design-for-res">
                                            <ul id="nav" className="navbar-nav mx-auto">
                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="#home">Home</a>
                                                </li>

                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="#about">About</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="#pricing">Pricing</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="#contact">Book a Demo</a>
                                                </li>
                                                {/* <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#team">Team</a>
                                        </li> */}
                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="#contact">Contact</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="ud-menu-scroll" href="/login">Login</a>
                                                </li>
                                                {/* <li className="nav-item nav-item-has-children">
                                            <a href="#"> Pages </a>
                                            <ul className="ud-submenu">
                                                <li className="ud-submenu-item">
                                                    <a href="about.html" className="ud-submenu-link">
                                                        About Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="pricing.html" className="ud-submenu-link">
                                                        Pricing Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="contact.html" className="ud-submenu-link">
                                                        Contact Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="blog.html" className="ud-submenu-link">
                                                        Blog Grid Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="blog-details.html" className="ud-submenu-link">
                                                        Blog Details Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="login.html" className="ud-submenu-link">
                                                        Sign In Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="404.html" className="ud-submenu-link">404 Page</a>
                                                </li>
                                            </ul>
                                        </li> */}
                                            </ul>
                                        </div> : null
                                }
                                <div className="navbar-collapse res-display">
                                    <ul id="nav" className="navbar-nav mx-auto">
                                        <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#home">Home</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#about">About</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#pricing">Pricing</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#contact">Book a Demo</a>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#team">Team</a>
                                        </li> */}
                                        <li className="nav-item">
                                            <a className="ud-menu-scroll" href="#contact">Contact</a>
                                        </li>
                                        {/* <li className="nav-item nav-item-has-children">
                                            <a href="#"> Pages </a>
                                            <ul className="ud-submenu">
                                                <li className="ud-submenu-item">
                                                    <a href="about.html" className="ud-submenu-link">
                                                        About Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="pricing.html" className="ud-submenu-link">
                                                        Pricing Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="contact.html" className="ud-submenu-link">
                                                        Contact Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="blog.html" className="ud-submenu-link">
                                                        Blog Grid Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="blog-details.html" className="ud-submenu-link">
                                                        Blog Details Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="login.html" className="ud-submenu-link">
                                                        Sign In Page
                                                    </a>
                                                </li>
                                                <li className="ud-submenu-item">
                                                    <a href="404.html" className="ud-submenu-link">404 Page</a>
                                                </li>
                                            </ul>
                                        </li> */}
                                    </ul>
                                </div>
                                {
                                    login ?
                                        <div className="navbar-btn d-none d-sm-inline-block res-display">
                                            <Link to={Cookies.get('user_role') === 'admin' ? "/dashboard/admin" : "/dashboard/admin/listofdoctor"} className="ud-main-btn ud-white-btn">
                                                Go to Dashboard
                                            </Link>
                                            {/* <Link className="ud-main-btn ud-white-btn" to="/register">
                                        Sign Up
                                    </Link> */}
                                        </div> : <div className="navbar-btn d-none d-sm-inline-block res-display">
                                            <Link to="/login" className="ud-main-btn ud-white-btn">
                                                Login
                                            </Link>
                                            {/* <Link className="ud-main-btn ud-white-btn" to="/register">
                                        Sign Up
                                    </Link> */}
                                        </div>
                                }

                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default React.memo(Header)
