const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.post('/reset', demoController.resetDemoState);
router.get('/state', demoController.getDemoState);
router.post('/simulate_fraud', demoController.simulateFraud);
router.post('/simulate_crisis', demoController.simulateCrisis);
router.post('/fire_engine', demoController.fireEngine);

module.exports = router;
