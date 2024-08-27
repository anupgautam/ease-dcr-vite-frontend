import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './styles/styles.css';
import Cookies from 'js-cookie';
import React, { useState, createContext, useEffect } from 'react';

// ----------------------------------------------------------------------
export const CookieContext = createContext();

export default function App() {
  const [cookieData, setCookieData] = useState({});

  const updateStatesFromCookies = () => {
    setCookieData({
      User_id: sessionStorage.getItem('User_id') ? sessionStorage.getItem('User_id') : Cookies.get('User_id'),
      access: sessionStorage.getItem('access') ? sessionStorage.getItem('access') : Cookies.get('access'),
      refresh: sessionStorage.getItem('refresh') ? sessionStorage.getItem('refresh') : Cookies.get('refresh'),
      company_division_name: sessionStorage.getItem('company_division_name') ? sessionStorage.getItem('company_division_name') : Cookies.get('company_division_name'),
      company_id: sessionStorage.getItem('company_id') ? sessionStorage.getItem('company_id') : Cookies.get('company_id'),
      company_user_id: sessionStorage.getItem('company_user_id') ? sessionStorage.getItem('company_user_id') : Cookies.get('company_user_id'),
      company_user_role_id: sessionStorage.getItem('company_user_role_id') ? sessionStorage.getItem('company_user_role_id') : Cookies.get('company_user_role_id'),
      email: sessionStorage.getItem('email') ? sessionStorage.getItem('email') : Cookies.get('email'),
      is_highest_priority: sessionStorage.getItem('is_highest_priority') ? sessionStorage.getItem('is_highest_priority') : Cookies.get('is_highest_priority'),
      user_role: sessionStorage.getItem('user_role') ? sessionStorage.getItem('user_role') : Cookies.get('user_role'),
      role: sessionStorage.getItem('role') ? sessionStorage.getItem('role') : Cookies.get('role'),
      other: sessionStorage.getItem('other') ? sessionStorage.getItem('other') : Cookies.get('other'),
      otherRoles: sessionStorage.getItem('other-roles') ? sessionStorage.getItem('other-roles') : Cookies.get('other-roles'),
      OTPgmail: sessionStorage.getItem('OTPgmail') ? sessionStorage.getItem('OTPgmail') : Cookies.get('OTPgmail'),
      otp: sessionStorage.getItem('otp') ? sessionStorage.getItem('otp') : Cookies.get('otp'),
    });
  };

  useEffect(() => {
    updateStatesFromCookies();

    const handleCookieChange = () => {
      updateStatesFromCookies();
    };

    window.addEventListener('cookieChange', handleCookieChange);

    return () => {
      window.removeEventListener('cookieChange', handleCookieChange);
    };
  }, []);

  const cookieContextValue = {
    User_id: cookieData?.User_id,
    access: cookieData?.access,
    refresh: cookieData?.refresh,
    company_division_name: cookieData?.company_division_name,
    company_id: cookieData?.company_id,
    company_user_id: cookieData?.company_user_id,
    company_user_role_id: cookieData?.company_user_role_id,
    email: cookieData?.email,
    is_highest_priority: cookieData?.is_highest_priority,
    user_role: cookieData?.user_role,
    role: cookieData?.role,
    other: cookieData?.other,
    otherRoles: cookieData?.otherRoles,
    OTPgmail: cookieData?.OTPgmail,
    otp: cookieData?.otp,
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <CookieContext.Provider value={cookieContextValue}>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
          </ThemeProvider>
        </CookieContext.Provider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
