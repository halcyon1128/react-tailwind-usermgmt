const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises; // Using promises for async file operations
const cors = require("cors");
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const app = express();
const PORT = process.env.PORT || 6060; // Vercel handles this automatically, keep this for local dev.
// const dataSource = "./usersData.json"; // Path to your JSON file
const JWT_SECRET = process.env.SECRET_KEY || "your_jwt_secret"; // Updated to use SECRET_KEY from .env

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000", // Use environment variable for flexibility
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/userManagement", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },
});

// Create the user model/Class
const User = mongoose.model("User", userSchema);

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error details for debugging
  res.status(500).json({ message: "Internal Server Error" }); // Send a generic error response
});

// Utility functions for reading and writing the data file// Utility functions for reading and writing the database
const readData = async () => {
  try {
    const users = await User.find(); // Fetch all users from the MongoDB 'users' collection
    return users; // Return the user data
  } catch (error) {
    console.error("Error reading data:", error);
    throw new Error("Error reading data from the database");
  }
};

const writeData = async (data) => {
  try {
    // You can clear the existing users collection and then insert the new data
    await User.deleteMany({}); // Clear the existing users
    await User.insertMany(data); // Insert new user data
  } catch (error) {
    console.error("Error writing data:", error);
    throw new Error("Error writing data to the database");
  }
};

/* ======================
React Router and User Profile Name-fetching
====================== */

// for App.js router handler
app.post("/userExists", async (req, res) => {
  const { id } = req.body;
  const users = await readData();
  const userExists = users.some((u) => u.id === id); // Check if the user exists
  res.json({ exists: userExists });
});

// for UserProfile fetching/mounting
app.post("/getUserName", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id; // Extract user _id from token

    const users = await readData(); // Fetch users from database
    const user = users.find((u) => u._id.toString() === userId); // Find the user by _id (converted to string)

    // If user found, respond with name
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* ======================
User Login and Logout
====================== */

// User Login - POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Check for blank email or password
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }
  const users = await readData(); // Read the user data from the database
  console.log("Attempting login with:", { email });
  const user = users.find((u) => u.email === email); // Find user by email
  // If user not found
  if (!user) {
    console.log("Login failed for:", { email });
    return res.status(404).json({ message: "Email not found." });
  }

  // Compare the password with the stored hashed password
  if (user.password === password) {
    // Create a JWT token for the user with user _id included in the payload
    const token = jwt.sign(
      {
        id: user._id, // Changed from user.id to user._id
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token back to the client
    res.json({
      token, // Just sending the token back
    });
  } else {
    console.log("Login failed for:", { email });
    return res.status(401).json({ message: "Incorrect password." });
  }
});

// Logout - POST /logout
app.post("/logout", async (req, res) => {
  const { email } = req.body;
  const users = await readData(); // Read user data from the JSON file
  const user = users.find((u) => u.email === email);
  if (user) {
    user.isLoggedIn = false; // Update the isLoggedIn status to false
    await writeData(users); // Save the updated user data
    // Optionally, you might want to send a response indicating that logout was successful
    res.json({ message: "Logout successful" });
    // Clear user data from local storage (assumed to be handled on the client-side)
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/* ======================
User management
====================== */

//fetch all users - TABLE MOUNTING
app.get("/userlist", async (req, res) => {
  try {
    const users = await readData(); // Fetch all users from the MongoDB 'users' collection
    // Generate tokens for each user and replace their _id with the token
    const usersWithTokens = users.map((user) => {
      // Generate a token with the user's _id in the payload
      const token = jwt.sign(
        {
          id: user._id, // Include user _id in the token payload
        },
        JWT_SECRET,
        { expiresIn: "1h" } // Set token expiration as needed
      );
      // Return user object with token instead of _id
      return {
        id: token,
        name: user.name,
        email: user.email,
        isLoggedIn: user.isLoggedIn,
        password: user.password, //to be removed later on
      };
    });
    // Respond with the modified user list
    res.json(usersWithTokens);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// CREATE NEW User 
app.post("/users", async (req, res) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  // Check if authToken is present
  if (!authToken) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    // Verify authToken and extract admin ID
    const decodedAuthToken = jwt.verify(authToken, JWT_SECRET);
    const adminId = decodedAuthToken.id; // Extract admin _id from the token

    // Read users from data to check if the admin exists
    const users = await readData();
    const adminUser = users.find((u) => u._id.toString() === adminId);

    // If admin user is found
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Prepare the new user object
    const newUser = {
      isLoggedIn: false,
      ...req.body, // Spread the request body into newUser
    };

    // Insert the new user into the database using User.create()
    const createdUser = await User.create(newUser);

    // Respond with the new user's data and ID
    res.status(201).json({ ...createdUser._doc }); // Return the created user object
  } catch (error) {
    console.error("Failed to add user:", error);
    res.status(500).json({ message: "Failed to add user: " + error.message });
  }
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
  const authToken = req.headers.authorization?.split(" ")[1];
  const decodedAuthToken = jwt.verify(authToken, JWT_SECRET);
  const tokenId = req.params.id;
  const users = await readData();
  const verified = users.find((u) => u._id.toString() === decodedAuthToken.id);

  // Check if token is present
  if (!authToken) {
    return res.status(401).json({ message: "Token required" });
  }

  if (verified) {
    try {
      const decodedToken = jwt.verify(tokenId, JWT_SECRET);
      const userIdFromToken = decodedToken.id; // Extract _id from the token

      const newUsers = users.filter(
        (u) => u._id.toString() !== userIdFromToken
      );

      if (newUsers.length !== users.length) {
        await writeData(newUsers);
        res.status(200).json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
});

//EditForm fields mounting
app.get("/users/:id", async (req, res) => {
  const tokenId = req.params.id; // Get the tokenized ID from the route parameters

  if (!tokenId) {
    return res.status(400).json({ message: "Tokenized ID required" });
  }

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(tokenId, JWT_SECRET); // Ensure this secret is correctly set
    const userId = decoded.id; // Extract user ID from the token

    // You can use readData() to fetch users or directly find the user
    const user = await User.findById(userId); // Fetch the user directly using Mongoose

    if (user) {
      res.json({ name: user.name, email: user.email });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE EXISTING User - PATCH /users/token
app.patch("/users/:id", async (req, res) => {
  const userIdToken = req.params.id; // Extract the user ID from the URL params
  const authToken = req.headers.authorization?.split(" ")[1]; // Extract authToken from the headers
  // Check if authToken is present
  if (!authToken) {
    return res.status(401).json({ message: "Token required" });
  }
  try {
    const decodedAuthToken = jwt.verify(authToken, JWT_SECRET); // Verify token and extract admin ID
    const userIdFromAuthToken = decodedAuthToken.id; // Extract _id from the authToken
    const decodedUserIdToken = jwt.verify(userIdToken, JWT_SECRET); // verify tokenized ID
    const userID = decodedUserIdToken.id; // Extract _id from the tokenized ID
    // Read users from data to check if the user exists
    const users = await readData();
    const adminUser = users.find(
      (u) => u._id.toString() === userIdFromAuthToken
    ); // Check for _id (converted to string)
    // If admin user is found
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    } else if (adminUser) {
      // Find the user to be updated by ID
      const userToUpdate = users.find((u) => u._id.toString() === userID); // Find the user by param.id
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update user information with the contents of updatedUser
      userToUpdate.name = req.body.name || userToUpdate.name; // Update name if provided
      userToUpdate.email = req.body.email || userToUpdate.email; // Update email if provided
      userToUpdate.password = req.body.password || userToUpdate.password; // Update password if provided
      await writeData(users); // Write changes to the database
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this user" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* ======================
User Settings
====================== */

// POST /settings - Get user data

//SettingsForm fields mounting
app.post("/settings", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, JWT_SECRET);
  const userId = decodedToken.id; // Extract _id from token

  const users = await readData();
  const user = users.find((u) => u._id.toString() === userId); // Check for _id (converted to string)

  // If user found, respond with name and email
  if (user) {
    res.json({ name: user.name, email: user.email, password: user.password });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update User Settings - PATCH /settings
app.patch("/settings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }
  try {
    // Verify token and extract user ID
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id; // Extract the _id from the token
    // Read users from data
    const users = await readData();
    const user = users.find((u) => u._id.toString() === userId); // Check for _id (converted to string)
    // If user found, check current password
    if (user) {
      // Check if the current password matches
      if (req.body.currentPassword !== user.password) {
        return res
          .status(403)
          .json({ message: "Current password is incorrect" });
      }
      // Update user information
      user.name = req.body.name || user.name; // Update name if provided
      user.email = req.body.email || user.email; // Update email if provided
      user.password = req.body.newPassword || user.password; // Update password

      await writeData(users); // Write changes to the database

      return res.status(200).json({ message: "User updated" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Listen on the specified port

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
