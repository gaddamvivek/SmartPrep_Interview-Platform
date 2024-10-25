const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const IDS  = require('../models/intrwdtlsschema')
const router = express.Router();
const admin = require('../firebaseAdmin');
const sessionTable = require('../models/sessionTable');
const Answer = require('../models/Answer');

router.use(express.json())
require('dotenv').config();

//checkEmail route
router.post('/checkEmail', async(req,res) => {
    const {email,password} = req.body;
    try{
        const userMail = await User.findOne({email});
        if(userMail){
            const hashedPassword = await bcrypt.hash(password, 10);
            userMail.password = hashedPassword;
            await userMail.save();
            return res.status(200).send("Password updated successfully");
        }
        else
            return res.status(404).send("User not found");
    }catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Error occured while updating password');
    }
})
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

router.post('/tsessions', async (req, res) => {
    const { userEmail, timeTaken, answers } = req.body;

    try {
        const newAnswer = new Answer({
            userEmail,
            timeTaken,
            answers,
        });

        await newAnswer.save();
        console.log('Session saved successfully:', newAnswer);
        res.status(201).json({ message: 'Answers saved successfully!' });
    } catch (error) {
        console.error('Error saving session:', error);
        res.status(500).json({ message: 'Error saving answers', error });
    }
});



// Interview Details route
router.post('/interviewdetails', async (req, res) => {
    const { prepname, diffLvl, slctround } = req.body;
    let token;
    let username;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify the token
            try {
                if (!process.env.TOKEN_SECRET_KEY) {
                    throw new Error("Secret key not found");
                }
                const fetchedDetails = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
                console.log(fetchedDetails)
                username = fetchedDetails.uname;
        // If the token was valid, save interview details
                const ids = new IDS({ username, prepname, diffLvl, slctround });
                await ids.save();                
                return res.send('success');
            } catch (error) {
                console.log(error);
                return res.status(401).json({ message: "Token verification failed" }); 
            }
        } else {
            console.error("Authorization header missing or incorrect");
            return res.status(401).json({ message: "Authorization header missing" }); 
        }
    } catch (err) {
        res.status(500).send('Error'); 
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userMail = await User.findOne({ email });
        if (!userMail)
            return res.status(400).send("User not found");
        const chkpwd = await bcrypt.compare(password, userMail.password);
        if (!chkpwd)
            return res.status(400).send('Invalid credentials');
        //Generate Json Web Token
        const payload = { mailid: email, uname: userMail.username }
        accessToken = jwt.sign(payload, process.env.TOKEN_SECRET_KEY);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
            userName: userMail.username
        });
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
