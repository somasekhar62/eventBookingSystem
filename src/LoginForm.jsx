import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowRight } from 'lucide-react';


const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case "email":
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
            case "password":
                return value.length < 8 ? "Password must be at least 8 characters" : "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", formData);

            if (response.data.success) {

                
                const { token, userType, userId } = response.data;



if (token) {
    localStorage.removeItem("user");
    localStorage.setItem("token", token); // ✅ Save token
    localStorage.setItem("user", JSON.stringify({ id: userId, role: userType.toLowerCase() })); // ✅ Save role + id

}
                toast.success("login successful");


                // Navigate based on user type
                if (response.data.userType === "organizer"){
                    navigate("/Organiser");
                }
                else if(response.data.userType === "customer"){
                    navigate("/customer");
                }
            } else {
                toast.warning(response.data.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };


        return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A73E8] mb-2">Welcome to Event.io</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
               value={formData.email}
               onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent pl-10"
                placeholder="Enter your email"
                required
              />
              <FaEnvelope className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent pl-10"
                placeholder="Enter your password"
                required
              />
              <FaLock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                            </button>
                            {/* {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>} */}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || Object.keys(errors).some((key) => errors[key])}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-[#1A73E8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8] transition-colors duration-300"
          >
            {isLoading ? "Loading..." : "Sign In"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                             Sign Up
          </Link>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to Event.io's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  </div>
);
};





export default LoginForm;
