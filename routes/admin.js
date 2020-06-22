const express = require('express');

const adminAuthController = require('../controllers/admin/auth')
const adminUserController = require('../controllers/admin/admin')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

/**
 * authentication routes
 */
router.get('/login',  adminAuthController.getLogin);
router.post('/login', adminAuthController.postLogin);
router.post('/logout', isAuth.isAuthAdmin, adminAuthController.postLogout);
router.get('/register', adminAuthController.getRegister);
router.post('/register', adminAuthController.postRegister);

/**
 * registerCollege
 */
router.get('/', isAuth.isAuthAdmin, adminUserController.getIndex);
router.get('/registerCollege', isAuth.isAuthAdmin, adminUserController.getRegisterCollege);
router.post('/registerCollege', isAuth.isAuthAdmin, adminUserController.postRegisterCollege);
router.post('/deleteCollege', isAuth.isAuthAdmin, adminUserController.postDeleteCollege);

/**
 * registerFaculty
 */

router.get('/registerFaculty', isAuth.isAuthAdmin, adminUserController.getRegisterFaculty);
router.post('/registerFaculty', isAuth.isAuthAdmin, adminUserController.postRegisterFaculty);
router.post('/deleteFaculty', isAuth.isAuthAdmin, adminUserController.postDeleteFaculty);


/**
 * registerDepartment
 */

router.get('/registerDepartment', isAuth.isAuthAdmin, adminUserController.getRegisterDepartment);
router.post('/registerDepartment', isAuth.isAuthAdmin, adminUserController.postRegisterDepartment);
router.post('/deleteDepartment', isAuth.isAuthAdmin, adminUserController.postDeleteDepartment);

/**
 * registerCourses
 */

router.get('/registerCourse', isAuth.isAuthAdmin, adminUserController.getRegisterCourse);
router.post('/registerCourse', isAuth.isAuthAdmin, adminUserController.postRegisterCourse);
router.post('/deleteCourse', isAuth.isAuthAdmin, adminUserController.postDeleteCourse);


/**
 * registerStaff
 */

router.get('/registerStaff', isAuth.isAuthAdmin, adminUserController.getRegisterStaff);
router.post('/registerStaff', isAuth.isAuthAdmin, adminUserController.postRegisterStaff);
router.post('/deleteStaff', isAuth.isAuthAdmin, adminUserController.postDeleteStaff);


/**
 * registerStudent
 */

router.get('/registerStudent', isAuth.isAuthAdmin, adminUserController.getRegisterStudent);
router.post('/registerStudent', isAuth.isAuthAdmin, adminUserController.postRegisterStudent);
router.post('/deleteStudent', isAuth.isAuthAdmin, adminUserController.postDeleteStudent);

/**
 * registerUnit
 */

router.get('/registerUnit', isAuth.isAuthAdmin, adminUserController.getRegisterUnit);
router.post('/registerUnit', isAuth.isAuthAdmin, adminUserController.postRegisterUnit);
router.post('/deleteUnit', isAuth.isAuthAdmin, adminUserController.postDeleteUnit);


/**
 * AssignUnits
 */

router.get('/assignUnits', isAuth.isAuthAdmin, adminUserController.getAssignUnit);
router.post('/assignUnits', isAuth.isAuthAdmin, adminUserController.postAssignUnit);



module.exports = router;