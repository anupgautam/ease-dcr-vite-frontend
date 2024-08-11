import React, { useEffect } from 'react';
import WOW from 'wow.js';
import './YourComponent.css'; // Import your component-specific CSS file

const mainReact = () => {
    useEffect(() => {
        // Sticky header logic
        const onScroll = () => {
            const ud_header = document.querySelector('.ud-header');
            const sticky = ud_header.offsetTop;
            const logo = document.querySelector('.navbar-brand img');
            const backToTop = document.querySelector('.back-to-top');

            if (window.pageYOffset > sticky) {
                ud_header.classList.add('sticky');
            } else {
                ud_header.classList.remove('sticky');
            }

            if (ud_header.classList.contains('sticky')) {
                logo.src = 'assets/images/logo/logo-2.svg';
            } else {
                logo.src = 'assets/images/logo/logo.svg';
            }

            if (
                document.body.scrollTop > 50 ||
                document.documentElement.scrollTop > 50
            ) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        };

        window.addEventListener('scroll', onScroll);

        // Navbar collapse logic
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        document.querySelectorAll('.ud-menu-scroll').forEach((e) =>
            e.addEventListener('click', () => {
                navbarToggler.classList.remove('active');
                navbarCollapse.classList.remove('show');
            })
        );

        navbarToggler.addEventListener('click', () => {
            navbarToggler.classList.toggle('active');
            navbarCollapse.classList.toggle('show');
        });

        // Submenu logic
        const submenuButton = document.querySelectorAll('.nav-item-has-children');
        submenuButton.forEach((elem) => {
            elem.querySelector('a').addEventListener('click', () => {
                elem.querySelector('.ud-submenu').classList.toggle('show');
            });
        });

        // Wow.js initialization
        new WOW().init();

        // Scroll to top logic
        const scrollTo = (element, to = 0, duration = 500) => {
            const start = element.scrollTop;
            const change = to - start;
            const increment = 20;
            let currentTime = 0;

            const animateScroll = () => {
                currentTime += increment;

                const val = Math.easeInOutQuad(currentTime, start, change, duration);

                element.scrollTop = val;

                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };

            animateScroll();
        };

        Math.easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        document.querySelector('.back-to-top').onclick = () => {
            scrollTo(document.documentElement);
        };
    }, []);

    return (
    // Your JSX content goes here
    // Make sure to include any necessary components and JSX structure
  );
};

export default mainReact;
