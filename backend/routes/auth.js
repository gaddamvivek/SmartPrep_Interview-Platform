const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const router = express.Router();
router.use(express.json())
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
    const {fname,lname, username, email, password } = req.body;
    console.log(fname)

    try {
        const userMail = await User.findOne({email});
        if(userMail)
            return res.status(400).send("Email already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const user = new User({ fname,lname,username,email, password: hashedPassword });
        await user.save();
        res.send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login route
router.post('/login', async (req,res) => {
    const {email,password} = req.body;
    try{
        const userMail = await User.findOne({email});
        if(!userMail)
            return res.status(400).send("User not found");
        else
            console.log("User Found")
        const chkpwd = await bcrypt.compare(password,userMail.password);
        if(!chkpwd)
            return res.status(400).send('Invalid credentials');
        else
            console.log("Correct Password")
        //Generate Json Web Token
        const payload = {mailid: email }
        accessToken = jwt.sign(payload,process.env.TOKEN_SECRET_KEY);
        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            accessToken: accessToken
        });
        //console.log(res);
    }
    catch (err){
        res.status(500).send('Error logging in');
    }
})
module.exports = router;
