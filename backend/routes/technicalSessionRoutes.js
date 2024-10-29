// routes/technicalSessionRoutes.js

const express = require('express');
const router = express.Router();
const technicalFeedbackController = require('../controllers/technicalFeedbackController');

router.get('/technicalFeedback', technicalFeedbackController.getTechnicalSessionFeedback);

module.exports = router;