const express = require('express');
const router = express.Router();
const {getuserdata,postuserdata,updatinguserdata} = require('../controllers/profile'); 
router.get('/getuserdata', getuserdata);
router.post('/postuserdata', postuserdata);
router.patch('/updatinguserdata',updatinguserdata);
module.exports = router;
