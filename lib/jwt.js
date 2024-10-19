const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Token required" });

  const secret = process.env.JWT_SECRET_KEY;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ status: "expire", message: "Token has expired" });
      } else {
        return res
          .status(403)
          .json({ status: "forbidden", message: "Invalid token" });
      }
    }

    console.log(user);
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  });
}

module.exports = authenticateToken;
