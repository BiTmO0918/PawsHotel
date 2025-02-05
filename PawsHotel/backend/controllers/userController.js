const User = require("../models/User");

// Function to get all users
const user_all = (req, res) => {
  User.find() // Fetch all users from the database
    .then((result) => {
      res.status(200).json(result); // Return the list of users with a 200 OK status
    })
    .catch((err) => {
      console.log(err); // Log any errors
      res.status(500).json({ error: 'Error fetching users.' }); // Return a 500 Internal Server Error status
    });
};

// Function to set a user as inactive
const user_inactive = (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  User.findByIdAndUpdate(userId, { active: false }, { new: true }) // Update the user to set active to false
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'User not found.' }); // Return a 404 Not Found status if the user is not found
      }
      res.status(200).json(result); // Return the updated user with a 200 OK status
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error deactivating user.' }); // Return a 500 Internal Server Error status
    });
}

// Function to set a user as active
const user_active = (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  User.findByIdAndUpdate(userId, { active: true }, { new: true }) // Update the user to set active to true
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'User not found.' }); // Return a 404 Not Found status if the user is not found
      }
      res.status(200).json(result); // Return the updated user with a 200 OK status
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error activating user.' }); // Return a 500 Internal Server Error status
    });
}

// Function to edit a user's profile
const edit_user_profile = (req, res) => {
  const userId = req.userId; // Get the user ID from the request (assumed to be set by middleware)
  const updatedData = req.body; // Get the updated data from the request body

  User.findByIdAndUpdate(userId, updatedData, { new: true }) // Update the user with the new data
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'User not found.' }); // Return a 404 Not Found status if the user is not found
      }
      res.status(200).json(result); // Return the updated user with a 200 OK status
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error updating user profile.' }); // Return a 500 Internal Server Error status
    });
}

module.exports = { user_all, user_inactive, user_active, edit_user_profile };
