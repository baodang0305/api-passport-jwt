const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userController.register);

router.post('/login-local', userController.login_local);

router.get('/login-facebook', userController.login_facebook);

router.get('/auth/facebook/callback', userController.authe_facebook_callback);
  

router.post('/update', userController.update);

router.get('/me', userController.profile);

module.exports = router;
