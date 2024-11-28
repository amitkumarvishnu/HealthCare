import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 
import { useFormik } from "formik";
import Joi from "joi";

const Login = ({
  setToken,
  setPatientId,
  setUsername,
  setRole,
  setDoctorId,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Joi Validation Schema
  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "any.required": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
  });

  // Formik Form Setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const { error } = loginSchema.validate(values, { abortEarly: false });
      const errors = {};

      if (error) {
        error.details.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      }
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          values
        );
        const {
          token,
          userId,
          username,
          role,
          doctorId: receivedDoctorId,
        } = response.data;

        setToken(token);
        setPatientId(userId);
        setUsername(username);
        setRole(role);
        localStorage.setItem("token", token);
        localStorage.setItem("patientId", userId);
        localStorage.setItem("role", role);

        if (role === "doctor") {
          setDoctorId(receivedDoctorId);
          localStorage.setItem("doctorId", receivedDoctorId);
          navigate("/doctor-dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Login failed", error.response ? error.response.data : error);
        const errorMessage = error.response?.data?.error || "Login failed";
        // setError(errorMessage);
        formik.setErrors({ email: errorMessage, password: errorMessage });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 mt-6 self-start ml-10 tracking-wide shadow-lg">
        Healthcare
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="hidden md:flex items-center justify-center p-10 relative">
          <img
            src="HealthCare UI.png"
            alt="Login Illustration"
            className="w-200"
          />
          <div className="absolute" style={{ top: '12vh', left: '6vw', color: 'white' }}>
            <h2 className="text-3xl font-semibold">Looking for an Expert</h2>
            <p className=" text-lg">Healthcare is home to some of the </p>
            <h className=" text-lg">eminent doctors in the world.</h>
          </div>
        </div>

        <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:bg-gray-100">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Login
          </h2>

          {formik.errors.email && formik.errors.password && (
            <p className="text-red-500 text-center mb-4">
              {formik.errors.email} {formik.errors.password}
            </p>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email address"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.errors.email && formik.touched.email && (
                <span className="text-sm text-red-500">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.errors.password && formik.touched.password && (
                <span className="text-sm text-red-500">
                  {formik.errors.password}
                </span>
              )}
            </div>

            <div className="text-right mb-4">
              <a href="/forgot-password" className="text-blue-600 text-sm">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:shadow-md transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* for navigating to register */}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

