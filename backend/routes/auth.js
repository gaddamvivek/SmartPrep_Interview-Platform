const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const IDSchema  = require('../models/intrwdtlsschema')
const router = express.Router();
const admin = require('../firebaseAdmin');
const sessionTable = require('../models/sessionTable');

router.use(express.json())
require('dotenv').config();


// Register route
router.post('/register', async (req, res) => {
    const { fname, lname, username, email, password } = req.body;

    try {
        const userMail = await User.findOne({ email });
        if (userMail)
            return res.status(400).send("Email already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const user = new User({ fname, lname, username, email, password: hashedPassword });
        await user.save();
        res.send('User registered successfully');
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Error registering user');
    }
});

router.post('/sessions', async (req, res) => {
        const { userEmail, timeTaken, solutions} = req.body;
        const formattedSolutions = Object.entries(solutions).map(([questionId, userSolution]) => ({
            questionID: questionId, // Use questionId as questionTitle
            userSolution: userSolution // The solution code
        }));
        console.log(formattedSolutions);
        try {
        const newSession = new sessionTable({
            userEmail,
            timeTaken,
            questions: formattedSolutions,
        });

        await newSession.save();
        console.log('Session saved successfully:', newSession); // Log success message
        res.status(201).json({ message: 'Coding session saved successfully!' });
    } catch (error) {
        console.error('Error saving session:', error);
        res.status(500).json({ error: 'Error saving session' });
    }
});


//Interview Details route
// Interview Details route
router.post('/interviewdetails', async (req, res) => {
    const { prepname, diffLvl, slctround } = req.body;
    let token;
    let username;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];
            console.log("Token received:", token);

            // Verify the token
            try {
                if (!process.env.TOKEN_SECRET_KEY) {
                    throw new Error("Secret key not found");
                }
                const fetchedDetails = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
                username = fetchedDetails.mailid;
                console.log("User mail ID:", username);

                // Send a response and return to avoid further code execution
            } catch (error) {
                console.log(error);
                return res.status(401).json({ message: "Token verification failed" }); // Send error response and stop execution
            }
        } else {
            console.error("Authorization header missing or incorrect");
            return res.status(401).json({ message: "Authorization header missing" }); // Send error response and stop execution
        }

        // If the token was valid, save interview details
        const ids = new IDSchema({ username, prepname, diffLvl, slctround });
        await ids.save();
        const savedDetails = await IDSchema.findOne({ username, prepname, diffLvl, slctround });
        if (savedDetails) {
            console.log('Data saved successfully:', savedDetails);
            res.status(201).json({ message: 'Interview details saved successfully!' });
        } else {
            console.log('Data not saved.');
            res.status(500).json({ error: 'Error saving interview details' });
        }
    } catch (err) {
        res.status(500).send('Error'); // Send error response if something fails
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userMail = await User.findOne({ email });
        if (!userMail)
            return res.status(400).send("User not found");
        else
            console.log("User Found")
        const chkpwd = await bcrypt.compare(password, userMail.password);
        if (!chkpwd)
            return res.status(400).send('Invalid credentials');
        else
            console.log("Correct Password")
        //Generate Json Web Token
        const payload = { mailid: email }
        accessToken = jwt.sign(payload, process.env.TOKEN_SECRET_KEY);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken
        });
        //console.log(res);
    }
    catch (err) {
        res.status(500).send('Error logging in');
    }
})



router.post('/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log('Google sign-in successful, user ID:', uid);

        // Proceed with login or sign-up logic

        res.status(200).json({ message: 'Login successful', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Token verification failed' });
    }
});

module.exports = router;
