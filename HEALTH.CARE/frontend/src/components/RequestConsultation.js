import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import Joi from "joi";

const RequestConsultation = ({ patientId, doctorId, onClose }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Joi schema for validation (only description and image)
  const validationSchema = Joi.object({
    description: Joi.string().required().messages({
      "any.required": "Description is required",
    }),
    image: Joi.any().required().messages({
      "any.required": "Image is required",
    }),
  });

  // Custom validation function using Joi
  const validate = (values) => {
    const { error } = validationSchema.validate(values, { abortEarly: false });
    const errors = {};

    if (error) {
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
    }

    return errors;
  };

  // Formik form initialization
  const formik = useFormik({
    initialValues: {
      description: "",
      image: null,
    },
    validate, // Pass Joi validate function to Formik
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("doctorId", doctorId);
      formData.append("description", values.description);
      formData.append("image", values.image);

      try {
        setLoading(true);
        await axios.post("http://localhost:5000/api/consultations/request", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Consultation requested successfully!");
        formik.resetForm();
        onClose();
      } catch (error) {
        console.error("Error requesting consultation:", error);
        alert("Failed to request consultation. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        <h2 className="text-lg font-semibold mb-4">Request a Consultation</h2>

        {/* Display error message if any */}
        {formik.errors.description || formik.errors.image ? (
          <div className="text-red-500 mb-4">
            {formik.errors.description || formik.errors.image}
          </div>
        ) : null}

        {/* Scrollable content */}
        <div className="flex-grow overflow-y-auto mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              {...formik.getFieldProps("description")}
              placeholder="Describe your symptoms or treatment needs"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
              rows="4"
            ></textarea>
            {formik.errors.description && formik.touched.description && (
              <div className="text-red-500 text-sm">{formik.errors.description}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1" htmlFor="image">
              Upload Image:
            </label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="w-full text-gray-500"
            />
            {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />}
            {formik.errors.image && formik.touched.image && (
              <div className="text-red-500 text-sm">{formik.errors.image}</div>
            )}
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="mt-4 flex flex-col space-y-2">
          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Requesting..." : "Request Consultation"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestConsultation;
