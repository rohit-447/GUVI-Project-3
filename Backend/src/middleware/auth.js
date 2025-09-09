const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Authentication middleware
exports.authenticate = passport.authenticate("jwt", { session: false });

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access - please log in" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
