import React, { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";

// Component for Doctor's Additional Information...
const DoctorModal = ({ isOpen, onClose, onSave }) => {
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [experience, setExperience] = useState(""); // Add experience state

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = () => {
    onSave({ specialization, contact, image, experience });
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Doctor Information</h3>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="specialization">
              Specialization
            </label>
            <input
              id="specialization"
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="Specialization"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="contact">
              Contact
            </label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="experience">
              Years of Experience
            </label>
            <input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Experience"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="image">
              Profile Image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mt-4 flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const Register = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("gender", values.gender); 

    if (values.role === "doctor" && doctorInfo) {
      formData.append("specialization", doctorInfo.specialization);
      formData.append("contact", doctorInfo.contact);
      formData.append("experience", doctorInfo.experience); 
      if (doctorInfo.image) {
        formData.append("image", doctorInfo.image);
      }
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Registration successful! Please verify your email.");
    } catch (error) {
      console.error("Registration failed", error);
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    if (role === "doctor") {
      setIsModalOpen(true);
    } else {
      setDoctorInfo(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex">
      <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400  self-start ml-10 tracking-wide shadow-lg">
        Healthcare
      </Link>
      <div className="w-1/2 flex items-center justify-center p-8">
          <img
            src="/HealthCare UI.png"
            alt="Illustration"
            className="w-200"
          />
          <div className="absolute" style={{ top: '25vh', left: '18vw', color: 'white' }}>
            <h2 className="text-3xl font-semibold">Looking for an Expert</h2>
            <p className=" text-lg">Healthcare is home to some of the <br/>eminent doctors in the world.</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="group bg-white p-8 rounded-lg shadow-lg max-w-md w-full transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Register</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <Formik
            initialValues={{
              email: "",
              username: "",
              password: "",
              role: "",
              gender: "", 
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) errors.email = "Email is required";
              if (!values.username) errors.username = "Username is required";
              if (!values.password) errors.password = "Password is required";
              if (!values.role) errors.role = "Role is required";
              if (!values.gender) errors.gender = "Gender is required"; 
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, handleChange, handleBlur }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="email"
                    className="w-full p-3 border rounded-lg"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="username"
                    className="w-full p-3 border rounded-lg"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="password"
                    className="w-full p-3 border rounded-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Gender</label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <Field
                    as="select"
                    name="role"
                    onChange={(e) => {
                      handleChange(e);
                      handleRoleChange(e.target.value);
                    }}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full p-3 rounded-lg text-white ${
                    isSubmitting || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isSubmitting || loading ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(info) => setDoctorInfo(info)}
      />
    </div>
  );
};

export default Register;
