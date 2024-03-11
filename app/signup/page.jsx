'use client'

import { useState } from "react";
import useAuthUser from "../../store/useAuthUser";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { register, isLoading, error } = useAuthUser();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form data on submit:", formData);
      try {
        await register(formData); 
        console.log("Registration successful");
      } catch (error) {
        console.error("Registration failed:", error);
      }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
