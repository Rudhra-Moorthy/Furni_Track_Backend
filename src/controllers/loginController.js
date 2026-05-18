const userService = require("../services/userService");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../services/tokenService");

// login api
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password is required to login.",
      });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // User roles
    const roles = await userService.getUserRoles(user.id);
    console.log(roles);
    // get permissions
    const permissions = await userService.getPermissions(user.id);
    console.log(permissions);

    const token = generateToken({
      id: user.id,
      email: user.email,
      roles,
      permissions,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { login };
