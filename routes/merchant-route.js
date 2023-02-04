const express = require('express');
const router  = express.Router();
const MerchantController = require('../controllers/merchant-controller');

const merchantController = new MerchantController();

router.get('/merchants', merchantController.getMerchantList);
router.get('/merchant', merchantController.getMerchant);
router.post('/merchant', merchantController.createMerchant);
router.patch('/merchant', merchantController.updateMerchant);
router.delete('/merchant', merchantController.deleteMerchant);

module.exports = router;