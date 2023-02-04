const express = require('express');
const router  = express.Router();
const AppController = require('../controllers/app-controller');

const appController = new AppController();

router.get('/getAppWebhookFields', appController.getAppWebhookFields);
router.get('/setAppWebhookFields', appController.setAppWebhookFields);

module.exports = router;