import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DropDown from './components/DropDown.jsx'

const ICCCertificateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tenure: "",
    college: "",
    post: "Intern",
    department: "",
    startDate: "",
    endDate: "",
    certificateName: "icc",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the changed field
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
    if (!formData.tenure) newErrors.tenure = "Tenure is required.";
    if (!formData.college) newErrors.college = "College is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.startDate) newErrors.startDate = "Starting Date is required.";
    if (!formData.endDate) newErrors.endDate = "Ending Date is required.";
    return newErrors;
  };

  const handleDownload = async () => {
    try {
      const { data, headers } = await axios.get(
        "http://localhost:8000/api/employee/icc",
        {
          params: { email: formData.email },
          responseType: "blob", // This ensures the response is treated as a binary file
        }
      );

      const fileName =
        headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || `${formData.name}_lcc.pdf`;

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
    // Here, handle the form submission logic, like sending data to the backend
    console.log("Form submitted:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/icc",
        formData,
        { withCredentials: true }
      );

      console.log("Form submitted successfully:", response);
      toast.success("Form submitted successfully!");

      // Trigger download immediately after successful form submission
      await handleDownload();
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-blue-700 font-bold text-lg text-center mb-4">
        Generate Your Internship Completion Certificate
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
          <label className="block text-gray-600">College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.college ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.college && (
            <span className="text-red-500 text-sm">{errors.college}</span>
          )}
        </div>

        <div>
          <label className="block text-gray-600">Tenure</label>
          <input
            type="text"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.tenure ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.tenure && (
            <span className="text-red-500 text-sm">{errors.tenure}</span>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Post</label>
          <select
            name="post"
            value={formData.post}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Intern">Intern</option>
            <option value="HOD">HOD</option>
            <option value="Sr. HOD">Sr. HOD</option>
            <option value="COO">COO</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600">Department</label>
          <DropDown formData={formData} setFormData={setFormData} required />

          {errors.department && (
            <span className="text-red-500 text-sm">{errors.department}</span>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Starting Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.startDate && (
            <span className="text-red-500 text-sm">{errors.startDate}</span>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Ending Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
          {errors.endDate && (
            <span className="text-red-500 text-sm">{errors.endDate}</span>
          )}
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">
        Generate Certificate
      </button>
    </form>
  );
};

export default ICCCertificateForm;
