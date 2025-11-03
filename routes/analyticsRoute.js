const express = require('express');
const router = express.Router();
const { recordVisit, getStats } = require('../controllers/analyticsController');

router.post('/visit', recordVisit);
router.get('/stats', getStats); 

module.exports = router;
