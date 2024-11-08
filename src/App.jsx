import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './styles/styles.css';

import Cookies from 'js-cookie';
import React, { useState, createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCookie } from './reducers/cookieReducer';

import io from 'socket.io-client';
import { BASE_URL } from './baseURL';
import { toast } from 'react-toastify';


// ----------------------------------------------------------------------

export default function App() {
  const [cookieData, setCookieData] = useState({
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
    company_area_id: sessionStorage.getItem('company_area_id') ? sessionStorage.getItem('company_area_id') : Cookies.get('company_area_id')
  });
  const roles = useSelector(state => state.cookie?.roles);

  useEffect(() => {
    const data = {
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
    }
    setCookieData(data);
  }, [roles]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (cookieData) {
      dispatch(setCookie(cookieData));
    }
  }, [cookieData, dispatch, roles]);


  const socket = io(BASE_URL, {
    withCredentials: true,
  });




  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      socket.emit('registerAdmin', Cookies.get('company_user_role_id'));
    });

    socket.on('Notification', (notification) => {
      console.log('Notification received:', notification.message);
      toast.success(notification.message);
    });

    return () => {
      socket.off('Notification');
      socket.disconnect();
      console.log('Disconnected from Socket.io server');
    };
  }, [socket, Cookies.get('company_user_role_id')]);


  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
