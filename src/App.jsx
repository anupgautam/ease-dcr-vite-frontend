import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './styles/styles.css';
import Cookies from 'js-cookie'

import React, { useState, createContext } from 'react'

// ----------------------------------------------------------------------
export const CookieContext = createContext();

export default function App() {

  const [User_id, setUser_id] = useState(Cookies.get('User_id'))
  const [access, setAccess] = useState(Cookies.get('access'))
  const [refresh, setrefresh] = useState(Cookies.get('refresh'))
  const [company_division_name, setcompany_division_name] = useState(Cookies.get('company_division_name'))
  const [company_id, setcompany_id] = useState(Cookies.get('company_id'))
  const [company_user_id, setcompany_user_id] = useState(Cookies.get('company_user_id'))
  const [company_user_role_id, setcompany_user_role_id] = useState(Cookies.get('company_user_role_id'))
  const [email, setemail] = useState(Cookies.get('email'))
  const [is_highest_priority, setis_highest_priority] = useState(Cookies.get('is_highest_priority'))
  const [user_role, setuser_role] = useState(Cookies.get('user_role'))
  const [role, setRole] = useState(Cookies.get('role'))
  const [other, setOther] = useState(Cookies.get('other'))
  const [otherRoles, setOtherRoles] = useState(Cookies.get('other-roles'))
  const [OTPgmail, setOTPgmail] = useState(Cookies.get('OTPgmail'))
  const [otp, setotp] = useState(Cookies.get('otp'))
  const cookieContextValue = {
    User_id,
    access,
    refresh,
    company_division_name,
    company_id,
    company_user_id,
    company_user_role_id,
    email,
    is_highest_priority,
    user_role,
    role,
    other,
    otherRoles,
    OTPgmail,
    otp
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
