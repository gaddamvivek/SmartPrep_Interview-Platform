const express=require('express');
const router=express.Router();
const {forgetpassword,register,login,google,sessions,tsessions,interviewdetails,testsubmit}= require('../controllers/auth');
router.post('/forgetpassword',forgetpassword);
router.post('/register',register);
router.post('/login',login);
router.post('/google',google);
router.post('/sessions',sessions);
router.post('/tsessions',tsessions);
router.post('/interviewdetails',interviewdetails);
router.post('/testsubmit',testsubmit);
module.exports=router;

