const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IDSchema  = require('../models/intrwdtlsschema');
const admin = require('../firebaseAdmin');
const sessionTable = require('../models/sessionTable');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const test = require('../models/testcases');


const forgetpassword=async(req,res) => {
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
};
const register= async (req, res) => {
    const { fname, lname, username, email, password } = req.body;

    try {
        const userMail = await User.findOne({ email });
        if (userMail)
            return res.status(400).send("Email already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fname, lname, username, email, password: hashedPassword });
        await user.save();
        res.send('User registered successfully');
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Error registering user');
    }
};

const sessions=async (req, res) => {
        const { userEmail, preparationName, sessionStartDate, sessionEndDate, sessionStartTime, sessionEndTime, timeTaken, solutions} = req.body;
        const formattedSolutions = Object.entries(solutions).map(([questionId, userSolution]) => ({
            questionID: questionId, // Use questionId as questionTitle
            userSolution: userSolution // The solution code
        }));
        try {
        const newSession = new sessionTable({
            userEmail,
            preparationName,
            sessionStartDate,
            sessionEndDate,
            sessionStartTime,
            sessionEndTime,
            timeTaken,
            questions: formattedSolutions,
        });

        await newSession.save();
        res.status(201).json({ message: 'Coding session saved successfully!' });
    } catch (error) {
        console.error('Error saving session:', error);
        res.status(500).json({ error: 'Error saving session' });
    }
};

const tsessions=async (req, res) => {
    const { userEmail, preparationName, sessionStartDate, sessionEndDate, sessionStartTime, sessionEndTime, timeTaken, answers } = req.body;

    try {
        const newAnswer = new Answer({
            userEmail,
            preparationName,
            sessionStartDate,
            sessionEndDate,
            sessionStartTime,
            sessionEndTime,
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
};


const testsubmit= async (req, res) => {
    console.log("Received data:", req.body);
    const { solutions } = req.body;
    if (!solutions || typeof solutions !== 'object') {
        console.error('Invalid solutions format:', solutions);
        return res.status(400).json({ message: 'Invalid input data' });
    }
    // Format solutions to include only questionID and userSolution initially
    const formattedSolutions = Object.entries(solutions).map(([questionId, userSolution]) => ({
        questionID: questionId,
        userSolution: userSolution
    }));

    try {
        // Get unique question IDs
        const questionIDs = formattedSolutions.map(solution => solution.questionID);

        // Retrieve the questions with matching questionIDs
        const questions = await Question.find({ _id: { $in: questionIDs } }).exec();

        // Map solutions to include test cases from the questions
        const solutionsWithTestCases = formattedSolutions.map(solution => {
            const question = questions.find(q => q._id.toString() === solution.questionID);
            return {
                questionID: solution.questionID,
                questiontitle:question.title,
                questiondescription:question.description,
                aisolution:question.solution,
                userSolution: solution.userSolution,
                testCases: question ? question.testCases.map(testCases => ({
                    input: testCases.input,
                    output: testCases.output ?? null
                })) : []
            };
        });

        // Save the solutions with test cases in the for-testcases model
        const newTestCaseEntry = new test({
            solutions: solutionsWithTestCases,
        });

        await newTestCaseEntry.save();

        console.log('Solutions with test cases saved for testing:', newTestCaseEntry);
        res.status(201).json({ message: 'Solutions saved successfully for testing!', newTestCaseEntry });
    } catch (error) {
        console.error('Error saving solutions for testing:', error);
        res.status(500).json({ message: 'Error saving solutions for testing', error });
    }
};


// Interview Details route
const interviewdetails= async (req, res) => {
    const { prepname, diffLvl, slctround, slctposition } = req.body;
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

                username = fetchedDetails.mailid;
                console.log("User mail ID:", username);

                // Send a response and return to avoid further code execution

                console.log(fetchedDetails)
                username = fetchedDetails.uname;
        // If the token was valid, save interview details
                // const ids = new IDS({ username, prepname, diffLvl, slctround });
                // await ids.save();                
                // return res.send('success');

                const ids = new IDSchema({ username, prepname, diffLvl, slctround, slctposition });
                await ids.save();
                const savedDetails = await IDSchema.findOne({ username, prepname, diffLvl, slctround, slctposition });
                if (savedDetails) {
                    console.log('Data saved successfully:', savedDetails);
                    res.status(201).json({ message: 'Interview details saved successfully!' });
                } else {
                    console.log('Data not saved.');
                    res.status(500).json({ error: 'Error saving interview details' });
                }
                
            } catch (error) {
                console.log(error);
                return res.status(401).json({ message: "Token verification failed" }); 
            }
        } else {
            console.error("Authorization header missing or incorrect");
            return res.status(401).json({ message: "Authorization header missing" }); 
        }


        // If the token was valid, save interview details
        


    } catch (err) {
        res.status(500).send('Error'); 
    }
};


// Login route
const login=async (req, res) => {
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
};

const google= async (req, res) => {
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
};

const verifyToken = async (token) => {
    try {
        // Try verifying Google token
        const decodedGoogleToken = await admin.auth().verifyIdToken(token);
        return { isGoogleToken: true, payload: decodedGoogleToken };
    } catch {
        // Fallback to JWT verification
        const decodedJwtToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        return { isGoogleToken: false, payload: decodedJwtToken };
    }
};

module.exports ={google,login,interviewdetails,testsubmit,tsessions,sessions,register,forgetpassword,verifyToken};
