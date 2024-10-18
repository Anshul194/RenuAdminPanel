import React from 'react';
import StarInternCertificateForm from './StarInternCertificateForm'; // Assuming the form component is in the same folder
import loginSvg from "../../public/Group.png";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Welcome to Renu Health Education Foundation
        </h1>
        <p className="mt-2 text-gray-600">
          Empowering future leaders through education and skill development.
        </p>
      </header>

      <img
            src={loginSvg}
            alt="Login Illustration"
            className="w-72 h-auto"
          />
 <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
          Generate Your Certificate Here just Via One Form
        </h2>

      <footer className="mt-8 text-center text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Renu Health Education Foundation. All Rights Reserved.
        </p>
        <p>
          For inquiries, contact us at{' '}
          
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
