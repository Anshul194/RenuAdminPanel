import React, { useState } from 'react';

const ICCCertificateForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    tenure: "",
    college: "",
    post: "Intern",
    department: "",
    startDate: "",
    endDate: "",
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
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.tenure) newErrors.tenure = "Tenure is required.";
    if (!formData.college) newErrors.college = "College is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.startDate) newErrors.startDate = "Starting Date is required.";
    if (!formData.endDate) newErrors.endDate = "Ending Date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    // Here, handle the form submission logic, like sending data to the backend
    console.log("Form submitted:", formData);
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
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
        
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        <div>
          <label className="block text-gray-600">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
        </div>
        <div>
          <label className="block text-gray-600">College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.college ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.college && <span className="text-red-500 text-sm">{errors.college}</span>}
        </div>
      
        <div>
          <label className="block text-gray-600">Tenure</label>
          <input
            type="text"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.tenure ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.tenure && <span className="text-red-500 text-sm">{errors.tenure}</span>}
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
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>}
        </div>
        <div>
          <label className="block text-gray-600">Starting Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
        </div>
        <div>
          <label className="block text-gray-600">Ending Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-md"
      >
        Generate Certificate
      </button>
    </form>
  );
};

export default ICCCertificateForm;
