const express = require('express');

const router = express.Router();
const rootController = require('../controllers')
const isAuth = require('../middleware/is-auth')

router.get('/', isAuth.isAuthUser, rootController.getIndex);

module.exports = router;