// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const secretKey = require("../configuration/jwtConfig");

// // Extract token from Authorization header
// function authenticateToken(req, res, next) {
//   const authHeader = req.header("Authorization");
//   if (!authHeader) {
//     return res.status(401).json({ message: "unauthorized:missing token!" });
//   }
//   const [bearer, token] = authHeader.split(" ");
//   if (bearer !== "Bearer" || !token) {
//     return res
//       .status(401)
//       .json({ message: "unauthorized:invalid token format!" });
//   }
//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       return res.status(401).json({ message: "forbidden:invalid token" });
//       console.log(authHeader);
//     }
//     req.user=user;
//     next();
//   })
// }
// function verifyToken(token) {
//   try {
//     return jwt.verify(token, secretKey);
//   } catch (err) {
//     throw new Error('Token is invalid or expired');
//   }
// }
// module.exports={authenticateToken,verifyToken};

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secretKey } = require("../configuration/jwtConfig");

// Extract token from Authorization header
function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: missing token!" });
  }

  // Split the Authorization header to extract "Bearer" and the token
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: invalid token format!" });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: invalid token" });
    }

    // Extract the username or other user details from the decoded token payload
    const { email, name } = decoded;
    req.user = {
      id: decoded.id, // assuming the user ID is stored in the token
      email: email,
      name: name,
    };
req.user=user;
    next(); // Proceed to the next middleware/route handler
  });
}

// Function to verify token directly and decode it
function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error("Token is invalid or expired");
  }
}

module.exports = { authenticateToken, verifyToken };
