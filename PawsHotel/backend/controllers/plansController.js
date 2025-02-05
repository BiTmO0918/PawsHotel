const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../uploads/pricePlans.json'); // Path to the price plans JSON file

// Function to get the price plans
const get_plans = (req, res) => {
  // Read the price plans JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file'); // Return a 500 Internal Server Error status if there's an error reading the file
    }
    res.send(JSON.parse(data)); // Send the parsed JSON data
  });
};

// Function to save the price plans
const save_plans = (req, res) => {
  const newPlans = req.body; // Get the new plans from the request body
  // Write the new plans to the price plans JSON file
  fs.writeFile(filePath, JSON.stringify(newPlans, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing file'); // Return a 500 Internal Server Error status if there's an error writing the file
    }
    res.send('Price plans updated successfully'); // Send a success message
  });
};

module.exports = { get_plans, save_plans };
