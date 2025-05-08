
import React, { createContext, useContext, useState } from 'react';

// Create a Context for Auth
const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(''); // Replace with actual user state management

  const login = (userData) => {
    setUser(userData); // Set user data upon login
  };

  const logout = () => {
    setUser(null); // Clear user data upon logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create a Context for Auth
// const AuthContext = createContext();

// // Create a Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Initialize user as null

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         try {
//           const response = await fetch('http://localhost:5000/auth/me', {
//             headers: { 'Authorization': `Bearer ${token}` }
//           });
//           const userData = await response.json();
//           setUser(userData);
//         } catch (error) {
//           console.error('Failed to fetch user', error);
//         }
//       }
//     };
//     fetchUser();
//   }, []);

//   const login = (userData) => {
//     setUser(userData); // Set user data upon login
//     localStorage.setItem('authToken', userData.token); // Store token
//   };

//   const logout = () => {
//     setUser(null); // Clear user data upon logout
//     localStorage.removeItem('authToken'); // Remove token from storage
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use Auth Context
// export const useAuth = () => useContext(AuthContext);
