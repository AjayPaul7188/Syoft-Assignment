import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const LoginPage = () => {
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async values => {
      // axios.post('http://localhost:3000/Api/userlogin/api/userlogin', values)
      //   .then(response => {
      //     localStorage.setItem('user', JSON.stringify(response.data));
      //     const jwtToken = response.jwtToken
      //     console.log(jwtToken)
      //     Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/dashboard'})
      //     navigate('/dashboard');
      //   })
      //   .catch(error => {
      //     console.error('There was an error logging in!', error);
      //   });

      const url = 'http://localhost:3000/Api/userlogin/api/userlogin';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      };

      try {
          const response = await fetch(url, options);
          // if (!response.ok) {
          //     throw new Error(`HTTP error! status: ${response.status}`);
          // }
          const data = await response.json();
          if (data.error === 'Invalid password' || data.error === 'User does not exist') {
            alert(data.error)
          } else {
            localStorage.setItem('user', JSON.stringify(data));
            const jwtToken = response.jwtToken
            console.log(jwtToken)
            Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/dashboard'})
            navigate('/dashboard');
          }

      } catch (error) {
          console.error('Error:', error);
      }
    }
  });

  return (
    <div className='login-container'>
      <div className='login-details'>
        <h1 className='login-heading'>Log In</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className='login-input-container'>
            <label className='input-label'>Email</label>
            <input
              className='user-input-1'
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
          </div>
          <div className='login-input-container'>
            <label className='input-label'>Password</label>
            <input
              className='user-input-1'
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
          </div>
          <button className='submit-btn1' type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
