
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userImage from "../media/user.png";
import { useAuth } from "../context/authContext"; // Import the hook
import axios from "axios";

const LoggedInNavBar = () => {
  const { user } = useAuth(); // Get user from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [username, setUsername] = useState("Guest");

  // State to manage profile data
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    occupation: "student",
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    setIsDropdownOpen(false); // Close the dropdown when profile modal is open
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => {
      const newProfileData = {
        ...prevState,
        [name]: value,
      };
      localStorage.setItem("profileData", JSON.stringify(newProfileData)); // Store in local storage
      return newProfileData;
    });
  };

  useEffect(() => {
    // Update the username based on the user object from context
    if (user) {
      setUsername(user.username || "Hello");
      // Load profile data from local storage
      const storedProfileData = JSON.parse(localStorage.getItem("profileData"));
      if (storedProfileData) {
        setProfileData(storedProfileData);
      }
    } else {
      setUsername("Guest");
    }
  }, [user]);

  return (
    <>
      {/* Navbar Component */}
      <div className="navbar bg-base-100 shadow-md">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {/* Mobile Links */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <Link to="/water-intake">Water Intake</Link>
              </li>
              <li>
                <Link to="/meets">Meets</Link>
              </li>
            </ul>
          </div>
          {/* Brand Logo */}
          <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
           Study Planner
          </Link>
        </div>

        {/* Navbar Center for Desktop Links */}
        <div className="navbar-center hidden lg:flex justify-end">
          <ul className="menu menu-horizontal px-1 space-x-4">
            <li>
              <Link to="/tasks" className="btn btn-outline">
                Tasks
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="btn btn-outline">
               Schedule
              </Link>
            </li>
            <li>
              <Link to="/ml_features" className="btn btn-outline">
                Study Assistant
              </Link>
            </li>
          </ul>
        </div>

        {/* Navbar End with Avatar */}
        <div className="navbar-end flex items-center space-x-4">
          <div className="relative">
            <div className="avatar cursor-pointer" onClick={toggleDropdown}>
              <div className="w-12 rounded-full">
                <img src={userImage} alt="Avatar" />
              </div>
            </div>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
                <p className="text-sm font-medium">{profileData.name}</p>
                <button
                  className="block text-sm text-blue-600 hover:underline mt-2"
                  onClick={toggleProfileModal}
                >
                  Profile
                </button>
                <Link
                  to="/"
                  className="block text-sm text-red-600 hover:underline mt-2"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profileData.weight}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profileData.height}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Occupation</label>
              <select
                name="occupation"
                value={profileData.occupation}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="student">Student</option>
                <option value="professional">Working Professional</option>
              </select>
            </div>
            {/* Close and Save buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="btn btn-error"
                onClick={toggleProfileModal}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  localStorage.setItem("profileData", JSON.stringify(profileData)); // Store profile data
                  toggleProfileModal();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoggedInNavBar;
