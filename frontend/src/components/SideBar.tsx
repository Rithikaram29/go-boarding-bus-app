import React, { useState } from "react";
import "./style/searchBar.css"

interface SideBarProps {
  onFilter: (filter: string) => void; // Function to handle filter selection
}


const SideBar: React.FC<SideBarProps> = ({ onFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (filter: string) => {
    const updatedFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter) // Remove filter if already selected
      : [...selectedFilters, filter]; // Add filter if not selected

    setSelectedFilters(updatedFilters);
    onFilter(updatedFilters.join(",")); // Pass the selected filters as a comma-separated string
  };

  return (
    <div className="sidebar p-2 bg-gray-100 shadow-md h-screen mr-10">
      <h3 className="text-md font-semibold mb-4">Filter by Time</h3>

      {/* Pickup Time Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Pickup Time</h4>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("pickupBefore6am")}
                onChange={() => handleCheckboxChange("pickupBefore6am")}
                className="mr-2 w-3 h-3"
              />
              Pickup Before 6 AM
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("pickup6am-4pm")}
                onChange={() => handleCheckboxChange("pickup6am-4pm")}
               className="mr-2 w-3 h-3"
              />
              Pickup 6 AM - 4 PM
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("pickupAfter4pm")}
                onChange={() => handleCheckboxChange("pickupAfter4pm")}
                className="mr-2 w-3 h-3"
              />
              Pickup After 4 PM
            </label>
          </li>
        </ul>
      </div>

      {/* Drop Time Filters */}
      <div>
        <h4 className="text-sm font-medium mb-3">Drop Time</h4>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("dropBefore6am")}
                onChange={() => handleCheckboxChange("dropBefore6am")}
                className="mr-2 w-3 h-3"
              />
              Drop Before 6 AM
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("drop6am-4pm")}
                onChange={() => handleCheckboxChange("drop6am-4pm")}
                className="mr-2 w-3 h-3"
              />
              Drop 6 AM - 4 PM
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.includes("dropAfter4pm")}
                onChange={() => handleCheckboxChange("dropAfter4pm")}
                className="mr-2 w-3 h-3"
              />
              Drop After 4 PM
            </label>
          </li>
        </ul>
      </div>

      {/* Reset Filters */}
      <div className="mt-6">
        <button
          onClick={() => {
            setSelectedFilters([]);
            onFilter("reset");
          }}
          className="block w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SideBar;
