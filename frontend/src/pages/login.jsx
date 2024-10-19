import React, { useState } from "react";
import loginSvg from "../../public/Group.png";
import { useNavigate } from "react-router";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/user/login", {
        email,
        password,
      },{
        withCredentials:true
      });
      console.log("Login successful!", response.data);
      navigate("/sidebar");

      localStorage.setItem("token", response.data.token);
    } catch (err) {
      console.log(err);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-300 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={loginSvg}
            alt="Login Illustration"
            className="w-72 h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col mt-8 md:mt-0 p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center md:text-left">
            Welcome Back!
          </h1>
          <p className="text-sm text-red-600">{errorMessage}</p>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  className="mr-2 leading-tight"
                />
                <label htmlFor="keepLoggedIn" className="text-sm text-gray-600">
                  Keep me logged in
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
