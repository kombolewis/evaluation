const express = require('express');

const staffAuthController = require('../controllers/staff/staff-auth')
const staffUserController = require('../controllers/staff/staff')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

/**
 * authentication routes
 */
router.get('/login',  staffAuthController.getLogin);
router.post('/login', staffAuthController.postLogin);
router.post('/logout', isAuth.isAuthStaff, staffAuthController.postLogout);


router.get('/', isAuth.isAuthStaff, staffUserController.getIndex);
router.get('/getAllStudents', isAuth.isAuthStaff, staffUserController.getAllStudents);
// router.get('/registerUnits', isAuth.isAuthStudent, studentUserController.getRegisterUnits);
// router.post('/registerUnits', isAuth.isAuthStudent, studentUserController.postRegisterUnit);


module.exports = router;
