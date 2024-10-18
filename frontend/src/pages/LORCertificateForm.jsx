import React, { useState } from 'react';

const LORCertificateForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    post: '',
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
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.post) newErrors.post = "Post is required.";
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
    console.log("Star Intern Certificate Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-blue-700 font-bold text-lg text-center mb-4">
        Generate Letter Of Recommendation Certificate
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
        </div>

        <div>
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
          <label className="block text-gray-600">Post</label>
          <input
            type="text"
            name="post"
            value={formData.post}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.post ? 'border-red-500' : 'border-gray-300'} rounded`}
            required
          />
          {errors.post && <span className="text-red-500 text-sm">{errors.post}</span>}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-md"
      >
        Generate LOR
      </button>
    </form>
  );
};

export default LORCertificateForm;
