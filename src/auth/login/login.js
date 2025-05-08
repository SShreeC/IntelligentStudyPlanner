// import React from 'react'
// import {useNavigate} from 'reacter-router-dom';
// import "./login.css";
// import {Button,Form} from 'react-bootstrap';
// const login=()=> {
//     const navigate=useNavigate();
//     const [formData, setFormData] = useState({
//       email: "",
//       password: "",
//     });
  
//     const handleInputChange = (event) => {
//       const { name, value } = event.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         const response =await fetch("http://localhost:5000/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         });
//         const result=await response.json();
//         localStorage.setItem('authToken',result.token);
//         // localStorage.setItem("token",result.token);
//         console.log(result);
//         navigate("/dashboard");
//       } catch (error) {
//         console.log(error.message);
//       } finally {
//         setFormData({ email: "", name: "", password: ";" });
//       }
//     };
//     return (
//         <div className="container mt-5">
//           <h2 className="text-center mb-4">Login</h2>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formBasicEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//               <Form.Text className="text-muted">
//                 We'll never share your email with anyone else.
//               </Form.Text>
//             </Form.Group>
//             {/* <Form.Group controlId="formBasicName">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//               />
//               <Form.Text className="text-muted"></Form.Text>
//             </Form.Group> */}
//             <Form.Group controlId="formBasicPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//               />
//             </Form.Group>
    
//             <Button variant="primary" type="submit" className="w-100">
//               Login
//             </Button>
//           </Form>
//         </div>
//       );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/authContext'; // Import the hook

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      login(result); // Call login from context with user data
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;
