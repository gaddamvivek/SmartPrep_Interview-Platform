const express=require('express');
const router=express.Router();
const {interviewlogs,stats}= require('../controllers/user');
router.get('/interviewlogs',interviewlogs);
router.get('/stats',stats);
module.exports=router;
