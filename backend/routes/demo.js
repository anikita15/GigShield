const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.post('/reset', demoController.resetDemoState);
router.post('/simulate_crisis', demoController.simulateCrisis);
router.post('/fire_engine', demoController.fireEngine);

module.exports = router;
