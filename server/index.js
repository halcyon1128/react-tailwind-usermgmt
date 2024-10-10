require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Using promises for async file operations
const cors = require('cors');
const jwt = require('jsonwebtoken'); // For generating JWT tokens

const app = express();
const PORT = process.env.PORT || 6060; // Vercel handles this automatically, keep this for local dev.
const dataSource = './usersData.json'; // Path to your JSON file
const JWT_SECRET = process.env.SECRET_KEY || 'your_jwt_secret'; // Updated to use SECRET_KEY from .env

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000' // Use environment variable for flexibility
}));

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error details for debugging
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error response
});

// Utility functions for reading and writing the data file
const readData = async () => {
    const rawData = await fs.readFile(dataSource);
    return JSON.parse(rawData);
};

const writeData = async (data) => {
    await fs.writeFile(dataSource, JSON.stringify(data, null, 2));
};


/* ======================
    React Router and User Profile Name-fetching
====================== */


// for App.js router handler
app.post('/userExists', async (req, res) => {
    const { id } = req.body;
    const users = await readData();
    const userExists = users.some(u => u.id === id); // Check if the user exists
    res.json({ exists: userExists });
});

// for UserProfile fetching
app.post('/getUserName', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.id; // Extract user ID from token

        const users = await readData(); // Fetch users from database
        const user = users.find(u => u.id === userId); // Find the user by ID

        if (user) {
            return res.json({ name: user.name }); // Respond with the user's name
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});


/* ======================
    User Login and Logout
====================== */

// User Login - POST /login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Check for blank email or password
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }
    const users = await readData(); // Read the user data from the JSON file
    console.log('Attempting login with:', { email });
    const user = users.find(u => u.email === email); // Find user by email
    if (!user) {
        console.log('Login failed for:', { email });
        return res.status(404).json({ message: 'Email not found.' });
    }
    // Compare the password with the stored hashed password
    if (user.password === password) {
        // Create a JWT token for the user with user ID included in the payload
        const token = jwt.sign({
            id: user.id,
        }, JWT_SECRET, { expiresIn: '1h' });
        // Send the token back to the client only
        res.json({
            token // Just sending the token back
        });
    } else {
        console.log('Login failed for:', { email });
        return res.status(401).json({ message: 'Incorrect password.' });
    }
});


// Logout - POST /logout
app.post('/logout', async (req, res) => {
    const { email } = req.body;
    const users = await readData(); // Read user data from the JSON file

    const user = users.find(u => u.email === email);

    if (user) {
        user.isLoggedIn = false; // Update the isLoggedIn status to false
        await writeData(users); // Save the updated user data

        // Optionally, you might want to send a response indicating that logout was successful
        res.json({ message: 'Logout successful' });

        // Clear user data from local storage (assumed to be handled on the client-side)
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


/* ======================
    User management
====================== */
app.get('/users', async (req, res) => {
    const users = await readData();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const users = await readData();
    const user = users.find(u => u.id === req.params.id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/users', async (req, res) => {
    const users = await readData();
    const newUser = {
        id: Date.now().toString(),
        isLoggedIn: false,
        ...req.body
    };

    users.push(newUser);
    await writeData(users);
    res.status(201).json(newUser);
});

app.patch('/users/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userIdFromToken = decodedToken.id;

        const users = await readData();
        const userIndex = users.findIndex(u => u.id === req.params.id);

        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], ...req.body };
            users[userIndex] = updatedUser;
            await writeData(users);

            if (req.params.id === userIdFromToken) {
                // Generate a new token with updated user info if ID matches
                const newToken = jwt.sign({
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    password: updatedUser.password,
                }, JWT_SECRET, { expiresIn: '1h' });

                return res.json({ ...updatedUser, token: newToken });
            } else {
                return res.json(updatedUser); // No new token if ID doesn't match
            }
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const users = await readData();
    const newUsers = users.filter(u => u.id !== req.params.id);

    if (newUsers.length !== users.length) {
        await writeData(newUsers);
        res.status(200).json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});



/* ======================
    User Settings
====================== */
app.get('/settings', async (req, res) => {
    const { email } = req.query;
    const users = await readData();
    const user = users.find(u => u.email === email);

    if (user) {
        res.json({ name: user.name, email: user.email });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// POST /settings - Get user data
app.post('/settings', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
    const users = await readData();
    const user = users.find(u => u.id === userId);

    if (user) {
        res.json({ name: user.name, email: user.email });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});