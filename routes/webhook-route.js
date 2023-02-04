const express = require('express');
const router  = express.Router();
const WebhookController = require('../controllers/webhook-controller');

const webhook = new WebhookController();

router.get('', webhook.getTest);
router.post('', webhook.postTest);

module.exports = router;
