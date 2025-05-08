const authService = require("../services/login");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Call the login service to get a token
    const token = await authService.login(email, password);
    
    // Return the token in the response
    res.json({ token: token });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

async function refreshToken(req, res) {
  try {
    const { token } = req.body;  // Get token from the request body
    
    // Call the refreshToken service to get a new token
    const newToken = await authService.refreshToken(token);
    
    // Return the new token in the response
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid token or credentials" });
  }
}

module.exports = { login, refreshToken };
