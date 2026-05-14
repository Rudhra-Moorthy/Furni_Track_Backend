const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {

    return res.status(401).json({
      message: "Access token is required",
    });

  }

  const token = authHeader.split(" ")[1];

  try {

    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = verified;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};

module.exports = authenticate;
