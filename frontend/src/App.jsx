import { useState } from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";
import Sidebar from "./pages/components/sidebar.jsx";
import Signup from "./pages/Signup.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000}/>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}
