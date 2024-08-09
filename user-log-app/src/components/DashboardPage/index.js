import React from 'react';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));


  const navigate = useNavigate()

  const onclickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <div className='dashBoard-container'>
      <h1 className='dash-heading'>Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.data.first_name}!</h2>
          <p>Email: {user.data.email}</p>
          <p>Phone: {user.data.phone_number}</p>
          <p>City: {user.data.city}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
      <button className='logout-btn' onClick={onclickLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
