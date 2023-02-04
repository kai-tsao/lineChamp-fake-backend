const express = require('express');
const router  = express.Router();
const isFBLoggedIn = require('../middleware/fb-auth');
const FBAuthController = require('../controllers/fb-auth-controller');

const fbAuth = new FBAuthController();

router.get('/status', isFBLoggedIn, fbAuth.status);
router.get('/popupEnd', fbAuth.popupEnd);
router.get('/logout', fbAuth.logout);
router.get('/logoutRedirect', fbAuth.logoutRedirect);
router.get('/error', (req, res) => res.send('Unknown Error'));
router.get('/facebook', fbAuth.login);
router.get('/facebook/callback', fbAuth.callback);
router.get('/setPageWebhook', fbAuth.setPageWebhook);
router.get('/getPageWebhookFields', fbAuth.getPageWebhookFields);
router.get('/postMsg', isFBLoggedIn, fbAuth.postMsg);
router.get('/setGreeting', isFBLoggedIn, fbAuth.setGreeting);
router.get('/setIceBreakers', isFBLoggedIn, fbAuth.setIceBreakers);
router.get('/setWelcome', isFBLoggedIn, fbAuth.setWelcome);
router.get('/getMessengerProfile', isFBLoggedIn, fbAuth.getMessengerProfile);

router.get('/showSession', isFBLoggedIn, (req, res) => {
    res.json(req.session);
});

module.exports = router;