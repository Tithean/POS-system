import { useState } from "react";
import axios from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post("/login", formData);
    if (result.data.token) {
      onLogin(result.data.user);
      navigate("/", { replace: true });
    } else {
      setMsg("Invalid email or password");
    }
  };

  const inputStyle = {
    backgroundColor: "#ffffff",
    color: "#1e3a5f",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border-2 border-white/20">
        {/* Header */}
        <div className="px-8 py-5 text-center bg-[#1e3a5f]">
          <img
            src="/POS_logo.png"
            alt="POS Logo"
            className="h-16 w-auto object-contain mx-auto"
          />
          <p className="text-blue-200 text-sm mt-1.5 font-medium">Point of Sale System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7">
          <h2 className="text-lg font-bold mb-5 text-[#1e3a5f]">Sign In</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm"
              style={inputStyle}
              placeholder="Enter your email"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm"
              style={inputStyle}
              placeholder="Enter your password"
              value={formData.Password}
              onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
            />
          </div>

          {msg && <p className="text-red-500 text-sm mb-3 font-medium">{msg}</p>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity bg-[#1e3a5f]"
          >
            Login
          </button>

          <p className="text-center text-sm text-[#1e3a5f]/80 mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold hover:underline text-[#2563eb]">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
