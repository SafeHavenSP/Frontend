import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import url from './url'
import axios from 'axios';
import './styles/Login.css'



import { auth, signInWithEmailAndPassword } from './firebaseConfig'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  


  const handleLogin = async () => {
    try {

      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      console.log('User signed in:', userCredential.user);
      const response = await axios.get(`${url.url}/getUserName`, {
        params: { username }, 
      });
  
      const userName = response.data.uname; 
  
      sessionStorage.setItem('username', userName);
      
      alert('Login successful!');
      navigate('/profile')
      
      
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className='body'>
      <div className='container'>
        <h1>Welcome to SafeHaven</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
