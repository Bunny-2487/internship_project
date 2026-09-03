// middleware/authMiddleware.js
// this checks if the request has a valid jwt token before letting it continue
// learned this part from a youtube tutorial, basically protects private routes

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // token usually sent like: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1]; // get the token part after "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Token format is wrong" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request so routes can use it
    next(); // move on to the actual route
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
