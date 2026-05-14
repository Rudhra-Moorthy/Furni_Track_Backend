const jwt = require("jsonwebtoken");

const jwtConfig = require("../config/jwt");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    },
    jwtConfig.accessSecret,
    {
      expiresIn: jwtConfig.accessExpires,
    },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpires,
    },
  );
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
