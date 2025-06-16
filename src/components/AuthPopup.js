
// export default AuthPopup;
import React from 'react';
import '../auth/signup/styles.css';
import AuthForm from '../auth/authForm';

const AuthPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="auth-popup-overlay fixed inset-0 flex items-center justify-center z-50">
      <div className="auth-popup-card bg-base-100 w-80 shadow-xl"> {/* Unique class for styling */}
        <div className="auth-popup-body card-body">
          <div className="auth-popup-actions card-actions justify-end">
            <button
              className="auth-popup-close-btn btn btn-square btn-sm"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
