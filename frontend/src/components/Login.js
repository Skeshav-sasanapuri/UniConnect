import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEmail } from '../context/EmailContext'; // Import the email context

function Login() {
  const navigate = useNavigate();
  const { setEmail } = useEmail();

  const handleSuccess = async (response) => {
    try {
      const token = response.credential; // Google ID token
      const backendResponse = await axios.post('http://localhost:8080/google_login', { token });

      if (backendResponse.data.success) {
        const { newUser, email } = backendResponse.data;
        console.log(backendResponse.data)

        setEmail(email);

        if (newUser) {
          navigate('/profile'); // Redirect to profile page for new users
        } else {
          navigate('/feed'); // Redirect to feed page for existing users
        }
      } else {
        alert('Login failed: ' + backendResponse.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleError = () => {
    alert('Google Login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="changeme">
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <img src="/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
          <h2>Login</h2>
          <div className="mt-3">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;

