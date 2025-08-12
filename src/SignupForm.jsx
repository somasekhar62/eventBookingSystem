
// import { useState } from "react";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const SignupForm = () => {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         email: "",
//         password: "",
//         phone: "",
//         userType: "Customer",
//     });

//     const [errors, setErrors] = useState({});
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const validateField = (name, value) => {
//         switch (name) {
//             case "fullName":
//                 return value.length < 2 ? "Name must be at least 2 characters" : "";
//             case "email":
//                 return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
//             case "password":
//                 return value.length < 8 ? "Password must be at least 8 characters" : "";
//             case "phone":
//                 return !/^\d{10}$/.test(value) ? "Invalid phone number" : "";
//             default:
//                 return "";
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         const error = validateField(name, value);
//         setErrors((prev) => ({ ...prev, [name]: error }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const newErrors = {};
//         Object.keys(formData).forEach((key) => {
//             const error = validateField(key, formData[key]);
//             if (error) newErrors[key] = error;
//         });

//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost:5000/signup", formData);
//             console.log("User registered:", response.data);
//             alert("Registration successful!");
//             setFormData({
//                 fullName: "",
//                 email: "",
//                 password: "",
//                 phone: "",
//                 userType: "Customer",
//             });
//         } catch (error) {
//             console.error("Error registering user:", error);
//             alert(error.response?.data?.message || "Something went wrong.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 flex items-center justify-center">
//             <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
//                 <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Create Account</h2>
//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                     {/* Full Name */}
//                     <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         placeholder="Full Name"
//                         className={`block w-full px-3 py-2 border rounded-lg ${
//                             errors.fullName ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

//                     {/* Email */}
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Email"
//                         className={`block w-full px-3 py-2 border rounded-lg ${
//                             errors.email ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

//                     {/* Password */}
//                     <div className="relative">
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="Password"
//                             className={`block w-full px-3 py-2 border rounded-lg ${
//                                 errors.password ? "border-red-500" : "border-gray-300"
//                             }`}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute inset-y-0 right-0 px-3 text-gray-400"
//                         >
//                             {showPassword ? <FaEyeSlash /> : <FaEye />}
//                         </button>
//                     </div>
//                     {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

//                     {/* Phone */}
//                     <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="Phone Number"
//                         className={`block w-full px-3 py-2 border rounded-lg ${
//                             errors.phone ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

//                     {/* User Type */}
//                     <select
//                         name="userType"
//                         value={formData.userType}
//                         onChange={handleChange}
//                         className="block w-full px-3 py-2 border rounded-lg"
//                     >
//                         <option value="Customer">Customer</option>
//                         <option value="Organizer">Organizer</option>
//                     </select>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="block w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//                     >
//                         {isLoading ? "Loading..." : "Sign Up"}
//                     </button>
//                 </form>
//                 <p className="text-sm text-center mt-4">
//                     Already have an account?{" "}
//                     <Link to="/login" className="font-medium text-blue-500">
//                         Sign In
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignupForm;







import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Phone, Eye, EyeOff } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    userType: "Customer"
  });

  const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case "fullName":
                return value.length < 2 ? "Name must be at least 2 characters" : "";
            case "email":
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
            case "password":
                return value.length < 8 ? "Password must be at least 8 characters" : "";
            case "phone":
                return !/^\d{10}$/.test(value) ? "Invalid phone number" : "";
            default:
                return "";
        }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            const response = await axios.post("http://localhost:5000/signup", formData);
            console.log("User registered:", response.data);
            setErrors({});
            toast.success("user registered successfully.");
            setFormData({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                userType: "Customer",
            });
            return navigate("/login");
        } catch (error) {
            console.error("Error registering user:", error);
            alert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-[#1A73E8] mb-2">Create an Account</h1>
            <p className="text-gray-600">Join Event.io to discover amazing events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent pl-10"
                  placeholder="Enter your full name"
                  required
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
            </div>

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
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent pl-10"
                  placeholder="Enter your phone number"
                  required
                />
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent pl-10 pr-10"
      placeholder="Create a password"
      required
    />
    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3.5 text-gray-500 focus:outline-none"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
  </div>
</div>


            <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="Customer">Customer</option>
                        <option value="Organizer">Organizer</option>
                    </select>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-[#1A73E8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8] transition-colors duration-300"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1A73E8] hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
{/* 
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to Event.io's Terms of Service and Privacy Policy
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Signup;