import React, { useState } from "react";
import axios from 'axios';
import {toast} from 'react-toastify'

const StarInternCertificateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    post: "",
    duration: "",
    certificateName: "starintern",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) newErrors.phone = "Phone Number is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.post) newErrors.post = "Post is required.";
    if (!formData.duration) newErrors.duration = "Duration is required."; // Validate duration
    return newErrors;
  };

  const handleDownload = async () => {
    try {
      const { data, headers } = await axios.get(
        "http://localhost:8000/api/employee/starintern",
        {
          params: { email: formData.email },
          responseType: "blob", // This ensures the response is treated as a binary file
        }
      );

      const fileName =
        headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || `${formData.name}_starIntern.pdf`;

      const blob = new Blob([data], {
        type: headers["content-type"] || "application/pdf",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error in downloading file:", err);
      toast.error(err.response.data.error);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    console.log("Star Intern Certificate Form submitted:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/starintern",
        formData,
        { withCredentials: true }
      );

      console.log("Form submitted successfully:", response);
      toast.success("Form submitted successfully");
      // Trigger download immediately after successful form submission
      await handleDownload();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response.data.error);

    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-blue-700 font-bold text-lg text-center mb-4">
        Generate Star Intern Certificate
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">Department</label>
          <DropDown formData={formData} setFormData={setFormData} required />
          {errors.department && (
            <span className="text-red-500 text-sm">{errors.department}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">Post</label>
          <input
            type="text"
            name="post"
            value={formData.post}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.post ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.post && (
            <span className="text-red-500 text-sm">{errors.post}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">
            Duration (weeks or months)
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.duration ? "border-red-500" : "border-gray-300"
            } rounded`}
            placeholder="Enter duration (e.g., 3 weeks or 2 months)"
            required
          />
          {errors.duration && (
            <span className="text-red-500 text-sm">{errors.duration}</span>
          )}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">
        Generate Star Intern Certificate
      </button>
    </form>
  );
};

export default StarInternCertificateForm;