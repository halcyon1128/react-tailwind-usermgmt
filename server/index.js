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

// Create the user model
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

// for UserProfile fetching
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
      return res.json({ name: user.name });
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

// Get all users - GET /users USERCONTEXT line 18
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
        name: user.name,
        email: user.email,
        isLoggedIn: user.isLoggedIn,
        password: user.password, //to be removed later on
        token, // Include the generated token
      };
    });

    // Respond with the modified user list
    res.json(usersWithTokens);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get User by ID
app.get("/users/token", async (req, res) => {
  try {
    // Retrieve token from Authorization header
    const token = req.headers.authorization.split(" ")[1]; // Assumes Bearer token format
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    const userId = decoded.id; // Assuming the user ID is stored in the token as `id`
    // Fetch users data
    const users = await readData();
    const user = users.find((u) => u._id.toString() === userId.toString()); // Check for _id
    // If user found, respond with user data
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/users", async (req, res) => {
  const users = await readData(); // This should now be from your MongoDB collection

  const newUser = {
    isLoggedIn: false,
    ...req.body,
  };

  // Assuming you have a MongoDB collection reference, you can insert the user directly
  const result = await usersCollection.insertOne(newUser); // Insert the new user into the MongoDB collection

  // You can return the newly created user with the MongoDB generated _id
  res.status(201).json({ ...newUser, _id: result.insertedId }); // Include the _id in the response
});

// Update User - PATCH /users/token
app.patch("/users/token", async (req, res) => {
  const { token, authToken, updatedUser } = req.body; // Extract parameters from request body

  // Check if both tokens are present
  if (!token || !authToken) {
    return res.status(401).json({ message: "Tokens required" });
  }

  try {
    // Extract _id from the token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userIdFromToken = decodedToken.id; // Extract _id from the token

    const users = await readData();
    const userIndex = users.findIndex(
      (u) => u._id.toString() === userIdFromToken
    ); // Check for _id (converted to string)

    // If user found, update the user data
    if (userIndex !== -1) {
      const updatedUserData = { ...users[userIndex], ...updatedUser };
      users[userIndex] = updatedUserData;
      await writeData(users); // Save updated user data

      // Extract _id from authToken and validate
      const decodedAuthToken = jwt.verify(authToken, JWT_SECRET);
      const userIdFromAuthToken = decodedAuthToken.id;

      if (userIdFromAuthToken === userIdFromToken) {
        // Generate a new token with the updated user details
        const newAuthToken = jwt.sign(
          { id: updatedUserData._id }, // Use updatedUserData._id
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({ ...updatedUserData, token: newAuthToken }); // Respond with updated user data and new token
      } else {
        return res.status(403).json({ message: "Token mismatch" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.delete("/users", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userIdFromToken = decodedToken.id; // Extract _id from the token

    const users = await readData();
    const newUsers = users.filter((u) => u._id.toString() !== userIdFromToken);

    if (newUsers.length !== users.length) {
      await writeData(newUsers);
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* ======================
User Settings
====================== */

// POST /settings - Get user data

// Fetch User Settings - POST /settings
app.post("/settings", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, JWT_SECRET);
  const userId = decodedToken.id; // Extract _id from token

  const users = await readData();
  const user = users.find((u) => u._id.toString() === userId); // Check for _id (converted to string)

  // If user found, respond with name and email
  if (user) {
    res.json({ name: user.name, email: user.email });
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

      await writeData(users); // Write changes to the data

      // Generate a new token with updated user info
      const newToken = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Return updated user info and new token
      return res.json({ token: newToken });
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
