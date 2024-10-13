require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose"); // Import mongoose
const fs = require("fs").promises; // Using promises for async file operations
const path = require("path");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Import the User model from index.js
const { User } = require("./index");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Read users from usersData.json
const importUsers = async () => {
    try {
        const dataPath = path.join(__dirname, "usersData.json");
        const rawData = await fs.readFile(dataPath);
        const users = JSON.parse(rawData);

        // Loop through users and save them to the database
        for (const user of users) {
            // Hash the password before saving
            user.password = await bcrypt.hash(user.password, 10); // Adjust the salt rounds if needed
            const newUser = new User(user);
            await newUser.save();
        }

        console.log("Users imported successfully!");
    } catch (err) {
        console.error("Error importing users:", err);
    } finally {
        mongoose.connection.close(); // Close the connection after import
    }
};

importUsers(); // Call the import function