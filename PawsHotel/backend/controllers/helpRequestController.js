const User = require("../models/User");
const HelpRequest = require("../models/HelpRequest");

// Function to create a new help request
const create_request = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    // Create a new HelpRequest document
    await HelpRequest.create({
      fullName,
      email,
      phone, // If phone is undefined, it will be saved as undefined in the document
      subject,
      message,
      active: true,
    });

    res.status(200).json({ message: "Help request registered successfully." });
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json({ message: "There was a problem registering the help request." });
  }
};

// Function to create a help request for a logged-in user
const create_user_request = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "No user found." });
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    const phone = user.phone;

    // Create a new HelpRequest document with user details
    await HelpRequest.create({
      fullName,
      email,
      phone,
      subject,
      message,
      active: true,
    });

    res.status(200).json({ message: "Help request registered successfully." });
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json({ message: "There was a problem registering the help request." });
  }
};

// Function to get all help requests
const request_all = (req, res) => {
  HelpRequest.find().sort({ createdAt: -1 }) // Sort by creation date in descending order
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err); // Log the error
      res.status(500).json({ error: 'Internal server error' }); // Return a 500 Internal Server Error status
    });
};

// Function to delete a help request by ID
const request_delete = (req, res) => {
  const requestId = req.params.id;

  HelpRequest.findByIdAndDelete(requestId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Help request not found' }); // Return a 404 Not Found status if the help request is not found
      }
      res.status(200).json(result); // Return the deleted help request
    })
    .catch((err) => {
      console.log(err); // Log the error
      res.status(500).json({ error: 'Error deleting help request' }); // Return a 500 Internal Server Error status
    });
};

module.exports = { create_request, create_user_request, request_all, request_delete };
