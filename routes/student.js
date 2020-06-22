const express = require('express');

const studentAuthController = require('../controllers/student/student-auth')
const studentUserController = require('../controllers/student/student')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

/**
 * authentication routes
 */
router.get('/login',  studentAuthController.getLogin);
router.post('/login', studentAuthController.postLogin);
router.post('/logout', isAuth.isAuthStudent, studentAuthController.postLogout);


router.get('/registerUnits', isAuth.isAuthStudent, studentUserController.getRegisterUnits);
router.post('/registerUnits', isAuth.isAuthStudent, studentUserController.postRegisterUnit);
router.get('/', isAuth.isAuthStudent, studentUserController.getIndex);



module.exports = router;
