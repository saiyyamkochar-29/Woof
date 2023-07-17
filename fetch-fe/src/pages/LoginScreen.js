// Import required libraries and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import './LoginScreen.css';
import { AccountCircle, Mail } from '@mui/icons-material';
import axios from 'axios';

// Define the LoginScreen component
function LoginScreen() {
  // Define state variables for name and email
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Use the useNavigate hook from react-router to programmatically navigate the app
  const navigate = useNavigate();

  // Define the form submission handler
  function handleSubmit(e) {
    // Prevent the form from refreshing the page
    e.preventDefault();

    console.log('Sending login request:', name, email);

    // Use axios to send a POST request to the login endpoint
    axios
      .post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        { name, email },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        
        // If the request was successful, navigate to the search page
        navigate('/search');
      })
      .catch((error) => {
        console.error(error);
        // Handle login error here, for example by setting an error message in the state
      });
  }

  // Render the login form
  return (
    <div>
      <h2 className='form-heading'>Login to find a new Friend!</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <TextField
          label="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className="input-field"
          InputProps={{ startAdornment: <AccountCircle className="icon"/> }}
        />
        <TextField
          label="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          className="input-field"
          InputProps={{ startAdornment: <Mail className="icon"/> }}
        />
        <Button variant="contained" color="primary" type="submit" className="login-button">
          Login
        </Button>
      </form>
    </div>
  );
}

// Export the component
export default LoginScreen;
