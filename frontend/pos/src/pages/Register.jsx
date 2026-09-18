import { useState } from "react";
import axios from "../api";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Gender: "",
    Password: "",
    DateOfBirth: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.Username.trim()) {
      toast.error("Please enter username");
      return;
    }
    if (!formData.Email.trim()) {
      toast.error("Please enter email");
      return;
    }
    if (!formData.Gender) {
      toast.error("Please select gender");
      return;
    }
    if (!formData.Password) {
      toast.error("Please enter password");
      return;
    }
    if (!formData.DateOfBirth) {
      toast.error("Please select date of birth");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/register", formData);
      if (response.data.token) {
        toast.success("Account created successfully!");
        if (onLogin) {
          onLogin(response.data.user);
        }
        navigate("/", { replace: true });
      } else {
        toast.success(response.data.message || "Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { backgroundColor: "#ffffff", color: "#1e3a5f" };
  const inputClass =
    "w-full px-3 py-2 rounded-lg border-2 border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-white p-4">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border-2 border-white/20">
        {/* Header */}
        <div className="px-8 py-5 text-center bg-[#1e3a5f]">
          <img
            src="/POS_logo.png"
            alt="POS Logo"
            className="h-14 w-auto object-contain mx-auto"
          />
          <p className="text-blue-200 text-sm mt-1.5 font-medium">Create New Account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="px-8 py-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Register</h2>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">Username</label>
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              placeholder="Enter your username"
              required
              value={formData.Username}
              onChange={(e) => setFormData({ ...formData, Username: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">Email</label>
            <input
              type="email"
              className={inputClass}
              style={inputStyle}
              placeholder="Enter your email"
              required
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">Gender</label>
            <select
              className={inputClass}
              style={inputStyle}
              required
              value={formData.Gender}
              onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
            >
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">Password</label>
            <input
              type="password"
              className={inputClass}
              style={inputStyle}
              placeholder="Enter your password"
              required
              value={formData.Password}
              onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a5f] mb-1">Date of Birth</label>
            <input
              type="date"
              className={inputClass}
              style={inputStyle}
              required
              value={formData.DateOfBirth}
              onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity mt-1 bg-[#1e3a5f] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-[#1e3a5f]/80">
            Already have an account?{" "}
            <Link to="/login" className="font-bold hover:underline text-[#2563eb]">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
