import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const submitHandler = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      { email, password }
    );

    // Optional success message
    alert("Registration successful. Please login.");

    // ✅ REDIRECT TO LOGIN
    navigate("/login");

  } catch (error) {
    alert(
      error.response?.data?.message || "Registration failed"
    );
  }
};


  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      onSubmit={submitHandler}
      className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-2 text-2xl font-bold text-center">
        Create an Account
      </h2>

      <p className="mb-6 text-center text-gray-500">
        Register to access the Academic Cloud Locker
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-6 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
      >
        Register
      </button>

      <p className="mt-6 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Login here
        </span>
      </p>
    </form>
  </div>
);

};

export default Register;
