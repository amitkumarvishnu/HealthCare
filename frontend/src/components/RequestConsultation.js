import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import Joi from "joi";

const RequestConsultation = ({ patientId, doctorId, timeSlot, onClose }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const validationSchema = Joi.object({
    description: Joi.string().required().messages({
      "any.required": "Description is required",
    }),
    images: Joi.array().min(1).max(5).required().messages({
      "any.required": "At least one image is required",
      "array.min": "At least one image is required",
      "array.max": "You can upload a maximum of 5 images.",
    }),
  });

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

  const formik = useFormik({
    initialValues: {
      description: "",
      images: [],
    },
    validate,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("doctorId", doctorId);
      formData.append("description", values.description);
      formData.append("date", timeSlot.date);
      formData.append("startTime", timeSlot.startTime);
      formData.append("endTime", timeSlot.endTime);

      values.images.forEach((image) => {
        formData.append("images", image);
      });

      try {
        setLoading(true);
        await axios.post("http://localhost:5000/api/consultations/request", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Consultation requested successfully!");
        formik.resetForm();
        setImageUrls([]);
        onClose();
      } catch (error) {
        console.error("Error requesting consultation:", error);
        alert("Failed to request consultation. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageUrls.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    // Update image URLs and formik images field
    const newImageUrls = [...imageUrls, ...files.map((file) => URL.createObjectURL(file))];
    formik.setFieldValue("images", [...formik.values.images, ...files]);
    setImageUrls(newImageUrls);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        <h2 className="text-lg font-semibold mb-4">Request a Consultation</h2>

        {formik.errors.description || formik.errors.images ? (
          <div className="text-red-500 mb-4">
            {formik.errors.description || formik.errors.images}
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
            <label className="block text-sm font-bold text-black mb-1" htmlFor="images">
              Upload Images (max 5):
            </label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-500 mb-2"
            />
            {imageUrls.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="h-32 object-cover rounded" />
                    <p className="text-xs text-center">{`Image ${index + 1}`}</p>
                  </div>
                ))}
              </div>
            )}
            {formik.errors.images && formik.touched.images && (
              <div className="text-red-500 text-sm">{formik.errors.images}</div>
            )}
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="mt-4 flex flex-col space-y-2">
          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
