import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const InternshipDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = {
    "Technology": [
      "UI/UX Design",
      "Graphic Designing",
      "Video Editing"
    ],
    "Marketing & Communications": [
      "Social Media Marketing",
      "Content Writing",
      "Public Relations",
      "Telecalling"
    ],
    "Social Impact": [
      "Fundraising Intern",
      "Charity Intern",
      "Medical Volunteer",
      "Corporate Social Responsibility (CSR)"
    ],
    "Management": [
      "Human Resource",
      "Team Leader",
      "Campus Ambassador",
      "Business Executive"
    ]
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white rounded-lg border border-gray-200 px-4 py-3 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="block truncate text-gray-700">
              {selectedCategory || "Select Internship Category"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-100 max-h-96 overflow-auto">
            {Object.entries(categories).map(([category, positions]) => (
              <div key={category} className="p-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-900 bg-gray-50 rounded-md">
                  {category}
                </div>
                <div className="mt-1">
                  {positions.map((position) => (
                    <button
                      key={position}
                      onClick={() => {
                        setSelectedCategory(position);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150"
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Position Display */}
      {selectedCategory && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Selected Position:</p>
          <p className="mt-1 text-blue-900">{selectedCategory}</p>
          <div className="mt-2 flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              3 Months
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Certificate
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Stipend
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipDropdown;