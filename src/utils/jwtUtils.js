// const jwt=require("jsonwebtoken");
// const {secretKey}=require("../configuration/jwtConfig");
// const { verifyToken } = require("./authMiddleware");
// function generateToken(user)
// {
// const payload={id:user._id,email:user.email}
// return jwt.sign(payload,secretKey,{expiresIn:"1h"}
// );

// function verifyToken(token)
// {
// try {
//     return jwt.verify(token,secretKey);
// } catch (error) {
//     throw new Error("invalid token");
// }
// }
// };
// module.exports={generateToken,verifyToken};
const jwt = require('jsonwebtoken');
const { secretKey } = require('../configuration/jwtConfig');
function generateToken(user)
{
const payload={id:user._id,email:user.email}
return jwt.sign(payload,secretKey,{expiresIn:"1h"}
);}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Token is invalid or expired" });

    req.user = user; // Attach decoded user to request
    next();
  });
}

module.exports = { generateToken, authenticateToken };
