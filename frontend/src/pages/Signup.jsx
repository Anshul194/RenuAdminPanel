import React, { useState } from "react";
import signupSvg from "../../public/Group.png";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/signup",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      alert("Signup successful!");

       navigate("/sidebar");
    } catch (err) {
      console.log(err);
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-300 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={signupSvg}
            alt="Signup Illustration"
            className="w-72 h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col mt-8 md:mt-0 p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center md:text-left">
            Create an Account
          </h1>
          <p className="text-sm text-red-600">{errorMessage}</p>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-green-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
