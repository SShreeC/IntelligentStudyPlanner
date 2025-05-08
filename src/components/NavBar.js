
import React from 'react';
import { Link } from 'react-router-dom';
import userImage from '../media/user.png';
import { useAuth } from '../context/authContext';

const NavBar = () => {
  const { user } = useAuth();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="navbar bg-white shadow-md fixed top-0 left-0 right-0 z-50" style={{background:'white'}}>
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
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={() => scrollToSection('features')}>Tasks</a>
            </li>
            <li>
              <a onClick={() => scrollToSection('features')}>Water Intake</a>
            </li>
            <li>
              <a onClick={() => scrollToSection('coming-soon')}>Meets</a>
            </li>
            {user ? (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            ) : (
              <li>
                <a onClick={() => scrollToSection('coming-soon')}>ChatBox</a>
              </li>
            )}
          </ul>
        </div>
        <a
          onClick={() => scrollToSection('hero')}
          className="btn btn-ghost normal-case text-xl cursor-pointer"
        >
          Study Planner
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li>
            <a onClick={() => scrollToSection('features')} className="btn btn-outline cursor-pointer">Tasks</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('features')} className="btn btn-outline cursor-pointer">Water Intake</a>
          </li>
          <li>
            <a onClick={() => scrollToSection('coming-soon')} className="btn btn-outline cursor-pointer">Meets</a>
          </li>
          {user ? (
            <li>
              <Link to="/profile" className="btn btn-outline">Profile</Link>
            </li>
          ) : (
            <li>
              <a onClick={() => scrollToSection('coming-soon')} className="btn btn-outline cursor-pointer">ChatBox</a>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-2">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={userImage} alt="Avatar" />
              </div>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{user.username}</p>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="btn btn-outline">Login</Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
