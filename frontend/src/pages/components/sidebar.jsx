import React, { useState, useEffect } from "react";
import { MdMailOutline } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { GoProject } from "react-icons/go";
import { MdGroupAdd } from "react-icons/md";
import { FaBars, FaUsers } from "react-icons/fa";
import OfferLetterCertificateForm from "../OfferLetterCertificate";
import ICCCertificateForm from "../IccCertificate";
import LORCertificateForm from "../LORCertificateForm";
import StarInternCertificateForm from "../StarInternCertificateForm";
import Dashboard from '../Dashboard'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedPanel, setSelectedPanel] = useState("dashboard");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (panel) => {
    setSelectedPanel(panel);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const renderPanelContent = () => {
    switch (selectedPanel) {
      case "generate-offer-letter":
        return <OfferLetterCertificateForm></OfferLetterCertificateForm>;

      case "generate-icc":
        return <ICCCertificateForm></ICCCertificateForm>;

      case "generate-lor":
        return <LORCertificateForm></LORCertificateForm>;

      case "generate-strt-inter":
        return <StarInternCertificateForm></StarInternCertificateForm>;

      default:
        return <Dashboard></Dashboard>;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Navbar */}
      <nav className="w-full bg-blue-600 p-4 flex justify-between items-center fixed top-0 z-10">
        <h1 className="text-white text-xl">Dashboard</h1>
        {/* Hamburger Menu for mobile view */}
        <button className="text-white md:hidden" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`bg-blue-600 h-full md:w-64 w-64 fixed top-0 left-0 z-20 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="pt-16 p-5">
          <ul className="space-y-4">
            <li
              className="flex items-center gap-2 text-white cursor-pointer hover:bg-blue-500 p-2 rounded-md"
              onClick={() => handleTabClick("dashboard")}
            >
              <IoPersonOutline size={24} />
              <span>Dashboard</span>
            </li>
            <li
              className="flex items-center gap-2 text-white cursor-pointer hover:bg-blue-500 p-2 rounded-md"
              onClick={() => handleTabClick("generate-offer-letter")}
            >
              <MdGroupAdd size={24} />
              <span>Generate Offer Letter</span>
            </li>
            <li
              className="flex items-center gap-2 text-white cursor-pointer hover:bg-blue-500 p-2 rounded-md"
              onClick={() => handleTabClick("generate-icc")}
            >
              <GoProject size={24} />
              <span>Generate ICC</span>
            </li>
            <li
              className="flex items-center gap-2 text-white cursor-pointer hover:bg-blue-500 p-2 rounded-md"
              onClick={() => handleTabClick("generate-lor")}
            >
              <MdMailOutline size={24} />
              <span>Generate LOR</span>
            </li>
            <li
              className="flex items-center gap-2 text-white cursor-pointer hover:bg-blue-500 p-2 rounded-md"
              onClick={() => handleTabClick("generate-strt-inter")}
            >
              <FaUsers size={24} />
              <span>Generate STRT Inter</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1  p-7 mt-16 md:ml-64">
        <div className="text-gray-600 mt-4">
          {renderPanelContent()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
