import React, { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";

// Modal Component for Doctor's Additional Info
const DoctorModal = ({ isOpen, onClose, onSave }) => {
  const [specialization, setSpecialization] = useState("");
  const [contact, setContact] = useState("");

  const handleSave = () => {
    onSave({ specialization, contact });
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Doctor Information</h3>

          <div className="mb-4">
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="Specialization"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact"
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);

    try {
      // Prepare data to be sent to backend
      const data = {
        email: values.email,
        username: values.username,
        password: values.password,
        role: values.role,
        ...(values.role === "doctor" && doctorInfo), // Only add doctor info if it's available
      };

      // Post the data to backend
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registration successful! Please verify your email.");
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response) {
        setError(`Registration failed: ${error.response.data.error}`);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    if (role === "doctor") {
      setIsModalOpen(true); // Show modal when doctor is selected
    } else {
      setDoctorInfo(null); // Reset doctor info when another role is selected
      setIsModalOpen(false); // Close modal
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-full max-h-screen overflow-auto">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-4">
          Healthcare Register
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            role: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email is required";
            }
            if (!values.username) {
              errors.username = "Username is required";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            if (!values.role) {
              errors.role = "Role is required";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange, handleBlur, touched, errors }) => (
            <Form className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email:</label>
                <Field
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username:</label>
                <Field
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Password:</label>
                <Field
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Role:</label>
                <Field
                  as="select"
                  name="role"
                  value={values.role}
                  onChange={(e) => {
                    handleChange(e);
                    handleRoleChange(e.target.value);
                  }}
                  onBlur={handleBlur}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>Select your role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-xs" />
              </div>

              <button
                type="submit"
                className={`w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-lg ${isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Doctor Modal */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(info) => setDoctorInfo(info)}
      />
    </div>
  );
};

export default Register;
