"use client";

import { useState } from "react";
import useAuthUser from "../../store/useAuthUser";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { login, isLoading, error } = useAuthUser();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Form data on submit:", formData);
    try {
      await login(formData)
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
