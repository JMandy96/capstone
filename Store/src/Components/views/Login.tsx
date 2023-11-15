import React, { useState } from "react";
import axios from "axios";
import './Styles/Login.css'
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../UserContext"

const Login = () => { 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useUser(); 
  const navigate = useNavigate();
  


  const handleChange = (e: React.FormEvent<HTMLInputElement>) => { 
    const { name, value } = e.currentTarget; 
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("https://rlvtg.onrender.com/api/login", formData);
      console.log("Login Response Data:", response.data); 
      
      if (response.data.access_token) {
        localStorage.setItem('userToken', response.data.access_token);
        const user = { id: response.data.user_id, is_admin: response.data.is_admin };
        localStorage.setItem('user', JSON.stringify(user));
        login(response.data.user_id);
        navigate("/products");
      } else {
        console.error("Token was not provided in the response");
      }
    } catch (error) {
      console.error("Error during login request:", error);
    }
  };
  return (
    <>
    <div className="container">
      <div className='login'>
        <h1>Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div className='inputs'>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign In</button>
          </div>
        </form>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  </>
  );
};

export default Login;