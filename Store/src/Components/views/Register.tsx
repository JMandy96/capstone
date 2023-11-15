import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import './Styles/Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const isFormIncomplete = Object.values(formData).some(field => !field);
    if (isFormIncomplete) {
        console.error("Please fill out all fields.");

        return;
    }


    try {
        const response = await axios.post("https://rlvtg.onrender.com/api/register", formData);
        console.log("Registration successful:", response.data);
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        });

    } catch (error) {

        console.error("Registration error:", error);

    }
};

  return (
    <>
      <div className='container'>
      <div className='Registration'>
        <h1>Register</h1>
        
        <form onSubmit={handleSubmit}>
          <div className='inputs'>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
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
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default Register;