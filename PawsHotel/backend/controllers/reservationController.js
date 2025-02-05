const Reservation = require("../models/Reservation");
const path = require("path");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid"); // Import the uuid module

// Function to create a new reservation
const create_reservation = async (req, res) => {
  try {
    let owner = req.body.owner;
    const {
      localization,
      startDate,
      endDate,
      animalName,
      animalSpecie,
      animalBreed,
      obs,
      discountCode,
      price,
      status,
    } = req.body;

    // If owner is not defined, retrieve the user information from the token
    if (owner === "undefined") {
      try {
        const user = await User.findById(req.userId);
        owner = `${user.firstName} ${user.lastName}`;
      } catch (err) {
        console.log("Error retrieving user information:", err);
        return res.status(500).json({ message: "Error retrieving user information" });
      }
    }

    // Check if files are present
    if (!req.files || !req.files.photo || !req.files.vaccinationCard) {
      return res.status(400).json({ message: "Photo and vaccination card are required." });
    }

    const photo = req.files.photo;
    const vaccinationCard = req.files.vaccinationCard;

    const maxFileSize = 1 * 1024 * 1024; // 1 MB

    // Check if file size exceeds the maximum limit
    if (photo.size > maxFileSize || vaccinationCard.size > maxFileSize) {
      return res.status(400).json({ message: "File size exceeds the maximum size (1 MB)." });
    }

    // Generate unique file names
    const uniquePhotoName = `${uuidv4()}_${photo.name}`;
    const uniqueVaccinationCardName = `${uuidv4()}_${vaccinationCard.name}`;

    const photoPath = path.join(__dirname, "../uploads/petPhotos/", uniquePhotoName);
    const vaccinationCardPath = path.join(__dirname, "../uploads/vaccinationRecords/", uniqueVaccinationCardName);

    // Move photo to the specified directory
    photo.mv(photoPath, (err) => {
      if (err) {
        console.log("Error moving photo:", err);
        return res.status(500).send(err);
      }
    });

    // Move vaccination card to the specified directory
    vaccinationCard.mv(vaccinationCardPath, (err) => {
      if (err) {
        console.log("Error moving vaccination card:", err);
        return res.status(500).send(err);
      }
    });

    // Create a new reservation document
    const newReservation = new Reservation({
      owner,
      localization,
      startDate,
      endDate,
      animalName,
      animalSpecie,
      animalBreed,
      photoURL: `/uploads/petPhotos/${uniquePhotoName}`,
      vaccinationCardURL: `/uploads/vaccinationRecords/${uniqueVaccinationCardName}`,
      obs,
      discountCode,
      price,
      status,
    });

    // Save the reservation to MongoDB
    await newReservation.save();

    res.status(201).json(newReservation);
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Function to list all reservations
const list_reservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Function to list reservations for a specific user
const list_user_reservations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const owner = `${user.firstName} ${user.lastName}`;

    const reservations = await Reservation.find({ owner: owner });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Function to get a reservation by ID
const get_reservation_by_id = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Function to update an existing reservation by ID
const update_reservation = async (req, res) => {
  try {
    const {
      localization,
      startDate,
      endDate,
      animalName,
      animalSpecie,
      animalBreed,
      obs,
      discountCode,
      price,
      status,
    } = req.body;

    let updateFields = {
      localization,
      startDate,
      endDate,
      animalName,
      animalSpecie,
      animalBreed,
      obs,
      discountCode,
      price,
      status,
    };

    // Check if files are present
    if (req.files) {
      if (req.files.photo) {
        const photo = req.files.photo;
        const uniquePhotoName = `${uuidv4()}_${photo.name}`;
        const photoPath = path.join(__dirname, "../uploads/petPhotos/", uniquePhotoName);
        photo.mv(photoPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
        });
        updateFields.photoURL = `/uploads/petPhotos/${uniquePhotoName}`;
      }
      if (req.files.vaccinationCard) {
        const vaccinationCard = req.files.vaccinationCard;
        const uniqueVaccinationCardName = `${uuidv4()}_${vaccinationCard.name}`;
        const vaccinationCardPath = path.join(__dirname, "../uploads/vaccinationRecords/", uniqueVaccinationCardName);
        vaccinationCard.mv(vaccinationCardPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
        });
        updateFields.vaccinationCardURL = `/uploads/vaccinationRecords/${uniqueVaccinationCardName}`;
      }
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Function to update the status of a reservation by ID
const update_reservation_status = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  create_reservation,
  list_reservations,
  list_user_reservations,
  get_reservation_by_id,
  update_reservation,
  update_reservation_status,
};
