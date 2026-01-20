import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    login(res.data);

    if (res.data.role === "student") navigate("/student");
    if (res.data.role === "faculty") navigate("/faculty");
    if (res.data.role === "admin") navigate("/admin");
  };

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      onSubmit={submitHandler}
      className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-2 text-2xl font-bold text-center">
        Welcome Back
      </h2>

      <p className="mb-6 text-center text-gray-500">
        Login to access your academic documents
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-6 border rounded"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button className="w-full py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700">
        Login
      </button>

      {/* Register link */}
      <p className="mt-6 text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Register here
        </span>
      </p>
    </form>
  </div>
);

};

export default Login;
