const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../authconfig");

// Function to handle user login
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).send("No user found."); // Return 404 if user is not found

    if (!user.active) return res.status(403).send('Your account has been deactivated.'); // Return 403 if user is inactive

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null }); // Return 401 if password is invalid

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // Expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token }); // Return 200 with token
  } catch (err) {
    res.status(500).send("Error on the server."); // Return 500 for server error
  }
};

// Function to handle user logout
const logout = (req, res) => {
  res.status(200).send({ auth: false, token: null }); // Return 200 with no token
};

// Function to handle user registration
const register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8); // Hash the password

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      password: hashedPassword, // Save hashed password
      active: true
    });

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 24 * 60 * 60, // Expires in 1 day
    });

    res.status(200).send({ auth: true, token: token }); // Return 200 with token
  } catch (err) {
    res.status(500).send("There was a problem registering the user."); // Return 500 for server error
  }
};

// Function to get the profile of the logged-in user
const profile = async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.userId);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("No user found."); // Return 404 if user is not found
    }

    res.status(200).send(user); // Return 200 with user data
  } catch (err) {
    res.status(500).send("There was a problem finding the user."); // Return 500 for server error
  }
};

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  console.log('Verifying token...');
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." }); // Return 403 if no token provided

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: "Failed to authenticate token." }); // Return 500 if token verification fails

    req.userId = decoded.id; // Save user ID to request for use in other routes
    console.log('User ID: ' + req.userId);
    next();
  });
};

// Middleware to verify if the user has admin role
const verifyRoleAdmin = async (req, res, next) => {
  console.log('Verifying admin role...');
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(403).send("No user found."); // Return 403 if user is not found
    }
    if (user.email === config.adminEmail) {
      next(); // Proceed if user is admin
    } else {
      return res.status(403).send({ auth: false, message: "Not authorized!" }); // Return 403 if user is not admin
    }
  } catch (err) {
    return res.status(500).send("There was a problem finding the user."); // Return 500 for server error
  }
};

// Function to check if the logged-in user is an admin
const checkAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send("No user found."); // Return 404 if user is not found
    const isAdmin = user.email === config.adminEmail; // Check if user email matches admin email
    console.log('isAdmin: ' + isAdmin);
    res.status(200).send({ isAdmin: isAdmin }); // Return 200 with admin status
  } catch (err) {
    res.status(500).send("There was a problem checking the user's role."); // Return 500 for server error
  }
};

module.exports = {
  login,
  logout,
  register,
  profile,
  verifyToken,
  verifyRoleAdmin,
  checkAdmin,
};
