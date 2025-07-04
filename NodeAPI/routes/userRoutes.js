const express = require('express');
const router = express.Router();
const { register, login, updateUser, changePassword } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.put('/update-user/:id', updateUser);
router.put('/change-password/:id', changePassword);

module.exports = router;
