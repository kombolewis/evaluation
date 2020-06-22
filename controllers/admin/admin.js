const bcrypt = require('bcryptjs');
const College = require('../../models/college');
const Faculty = require('../../models/faculty');
const Department = require('../../models/department');
const Course = require('../../models/course');
const Staff = require('../../models/staff');
const Student = require('../../models/student');
const Unit = require('../../models/unit');
const client =  require('./client');

/**
 * Home page
 */

exports.getIndex = (req,res,next) => {
    res.render('admin/index',{
        pageTitle:'Home',
        name: req.session.admin.email.split('@')[0]
    });
}

/**
 * registerCollege
 */

exports.getRegisterCollege = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    College.findAll({raw:true})
    .then(allColleges => {
        res.render('admin/registerCollege', {
            pageTitle:'Register College',
            allColleges,
            errorMessage,
            success

        });
    
    }).catch(err => {
        console.log(err);
    });

}

exports.postRegisterCollege = (req,res,next) => {
    const col_name =  req.body.col_name;
    
    if(!col_name || col_name == ' '){
        req.flash('error', 'please provide valid data');
        return res.redirect('/admin/registerCollege');
    }
    College.findOne({where: {col_name:col_name}})
    .then(result => {
        if(result){ // returns one result
            req.flash('error', 'College already exists');
            return res.redirect('/admin/registerCollege');
        }
        return College.findAll({raw:true}) //no result so check all just in case

    }).then(result => {
        if (result.length == 0){ //no record in db
            return College.findAll({
                order:[['createdAt','DESC']]
            })
        }else if(
            (result.filter((data) => {  // if there's data it doesnt match the current search
            return data.col_name.toLowerCase() === col_name.toLowerCase();
        })).length == 0) {
            return College.findAll({
                order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'College already exists');
            return res.redirect('/admin/registerCollege');
        }
    })
    .then(result =>{
        if(result.length == 0){ // no records
            let order = 1;
            const col_code = 'col_00'.concat(order.toString()).toUpperCase()
            return College.create({
                col_code,
                col_name
            });
        }
        let order = parseInt(result[0].col_code.split('_')[1]);
        const col_code = 'col_00'.concat((++order).toString()).toUpperCase();
        return College.create({
            col_code,
            col_name
        });
    }).then(result => {
        req.flash('success', 'College created successfully')
        res.redirect('/admin/registerCollege');
    }).catch(err => {
        req.flash('error', 'Something went wrong with college creation.Please try again');
        res.redirect('/admin/registerCollege');
        console.log(err);

    });


}

exports.postDeleteCollege = (req,res,next) => {
    College.findByPk(parseInt(req.body.col_id))
    .then(record => {
        if(record){
            res.redirect('/admin/registerCollege')
            return record.destroy();
        }
        return 'error destroying field';
    }).catch(err =>{
        req.flash('error', 'error removing college');
        console.log(err)
    })
}

/**
 * registerFaculty
 */

exports.getRegisterFaculty = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allFaculties = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Faculty.findAll({raw:true})
    .then(faculty => {
        allFaculties = faculty;
        return College.findAll({raw:true})
    
    }).then(allColleges => {
        res.render('admin/registerFaculty', {
            pageTitle:'Register Faculty',
            allColleges,
            allFaculties,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterFaculty = (req,res,next) => {
    const selectedCollege =  req.body.selectColleges;
    const fac_name = req.body.fac_name;
    let col_code = '';
    let collegeId = '';


    if(!selectedCollege || selectedCollege == ' '){
        req.flash('error', 'please provide valid college data');
        return res.redirect('/admin/registerFaculty');
    }
    if(!fac_name || fac_name == ' '){
        req.flash('error', 'please provide valid Faculty data');
        return res.redirect('/admin/registerFaculty');
    }

    College.findOne({where:{col_name:selectedCollege}})
    .then(college => {
        col_code = college.col_code
        collegeId = college.id
    }).catch(err => {
        console.log(err)
    });


    Faculty.findOne({where: {fac_name:fac_name}})
    .then(faculty => {
        if(faculty){
            req.flash('error', 'Faculty already exists');
            return res.redirect('/admin/registerFaculty');
        }
        return Faculty.findAll({raw:true})

    }).then(faculty => {
        if (faculty.length == 0){ // no db records so no duplicates
            return Faculty.findAll({
                order:[['createdAt','DESC']]
            })
        }else if(
            (faculty.filter((data) => {
            return data.fac_name.toLowerCase() === fac_name.toLowerCase();
        })).length == 0) {
            return Faculty.findAll({
                order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'Faculty already exists');
            return res.redirect('/admin/registerFaculty');
        }
    })
    .then(result =>{
        if(result.length == 0){
            let order = 1;
            const fac_code = 'fac_00'.concat(order.toString()).toUpperCase()
            return Faculty.create({
                fac_code,
                fac_name,
                col_code,
                collegeId
            });
            
        }
        let order = parseInt(result[0].fac_code.split('_')[1]);
        const fac_code = 'fac_00'.concat((++order).toString()).toUpperCase();
        console.log(fac_code);
        return Faculty.create({
            fac_code,
            fac_name,
            col_code,
            collegeId
        });
    }).then(result => {
        req.flash('success', 'Faculty created successfully');
        res.redirect('/admin/registerFaculty');
    }).catch(err => {
        req.flash('error', 'Something went wrong with Faculty creation.Please try again');
        res.redirect('/admin/registerFaculty');
        console.log(err);

    });


}

exports.postDeleteFaculty = (req,res,next) => {
    Faculty.findByPk(parseInt(req.body.fac_id))
    .then(record => {
        if(record){
            req.flash('success', 'Faculty removed successfully')
            res.redirect('/admin/registerFaculty')
            return record.destroy();
        }
        return 'error destroying field';
    }).catch(err =>{
        req.flash('error', 'error removing Faculty');
        console.log(err)
    })
}


/**
 * registerDepartment
 */

exports.getRegisterDepartment = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allFaculties = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Faculty.findAll({raw:true})
    .then(faculty => {
        allFaculties = faculty;
        return Department.findAll({raw:true})
    
    }).then(allDepartments => {
        res.render('admin/registerDepartment', {
            pageTitle:'Register Department',
            allDepartments,
            allFaculties,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterDepartment = (req,res,next) => {
    const selectedFaculty =  req.body.selectFaculty;
    const dep_name = req.body.dep_name;
    let fac_code = '';
    let facultyId = '';


    if(!selectedFaculty || selectedFaculty == ' '){
        req.flash('error', 'please provide valid faculty data');
        return res.redirect('/admin/registerDepartment');
    }
    if(!dep_name || dep_name == ' '){
        req.flash('error', 'please provide valid departments data');
        return res.redirect('/admin/registerDepartment');
    }

    Faculty.findOne({where:{fac_name:selectedFaculty}})
    .then(faculty => {
        fac_code = faculty.fac_code
        facultyId = facultyId.id
    }).catch(err => {
        console.log(err)
    });


    Department.findOne({where: {dep_name:dep_name}})
    .then(department => {
        if(department){
            req.flash('error', 'Department already exists');
            return res.redirect('/admin/registerDepartment');
        }
        return Department.findAll({raw:true})

    }).then(department => {
        if (department.length == 0){ // no db records so no duplicates
            return Department.findAll({
                order:[['createdAt','DESC']]
            })
        }else if(
            (department.filter((data) => {
            return data.dep_name.toLowerCase() === dep_name.toLowerCase();
        })).length == 0) {
            return Department.findAll({
                order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'Department already exists');
            return res.redirect('/admin/registerDepartment');
        }
    })
    .then(result =>{
        if(result.length == 0){
            let order = 1;
            const dep_code = 'dep_00'.concat(order.toString()).toUpperCase()
            return Department.create({
                dep_code,
                dep_name,
                fac_code,
                facultyId
            });
            
        }
        let order = parseInt(result[0].dep_code.split('_')[1]);
        const dep_code = 'dep_00'.concat((++order).toString()).toUpperCase();
        return Department.create({
            dep_code,
            dep_name,
            fac_code,
            facultyId
        });
    }).then(result => {
        req.flash('success', 'Department created successfully');
        res.redirect('/admin/registerDepartment');
    }).catch(err => {
        req.flash('error', 'Something went wrong with Department creation.Please try again');
        res.redirect('/admin/registerDepartment');
        console.log(err);

    });


}

exports.postDeleteDepartment = (req,res,next) => {
    Department.findByPk(parseInt(req.body.dep_id))
    .then(record => {
        if(record){
            req.flash('success', 'Department removed successfully')
            res.redirect('/admin/registerDepartment')
            return record.destroy();
        }
        return 'error destroying field';
    }).catch(err =>{
        req.flash('error', 'error removing Department');
        console.log(err)
    })
}

/**
 * registerCourse
 */

exports.getRegisterCourse = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allDepartments = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Department.findAll({raw:true})
    .then(departments => {
        allDepartments = departments;
        return Course.findAll({raw:true})
    
    }).then(allCourses => {
        res.render('admin/registerCourse', {
            pageTitle:'Register Course',
            allCourses,
            allDepartments,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterCourse = (req,res,next) => {
    const selectedDepartment =  req.body.selectDepartment;
    const course_name = req.body.course_name;
    let dep_code = '';
    let departmentId = '';


    if(!selectedDepartment || selectedDepartment == ' '){
        req.flash('error', 'please provide valid department data');
        return res.redirect('/admin/registerDepartment');
    }
    if(!course_name || course_name == ' '){
        req.flash('error', 'please provide valid course data');
        return res.redirect('/admin/registerCourse');
    }

    Department.findOne({where:{dep_name:selectedDepartment}})
    .then(department => {
        dep_code = department.dep_code
        departmentId = department.id
    }).catch(err => {
        console.log(err)
    });


    Course.findOne({where: {course_name:course_name}})
    .then(course => {
        if(course){
            req.flash('error', 'Course already exists');
            return res.redirect('/admin/registerCourse');
        }
        return Course.findAll({raw:true})

    }).then(course => {
        if (course.length == 0){ // no db records so no duplicates
            return Course.findAll({
                order:[['createdAt','DESC']]
            })
        }else if(
            (course.filter((data) => {
            return data.course_name.toLowerCase() === course_name.toLowerCase();
        })).length == 0) {
            return Course.findAll({
                order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'Course already exists');
            return res.redirect('/admin/registerCourse');
        }
    })
    .then(result =>{
        if(result.length == 0){
            let order = 1;
            const course_code = 'CO_00'.concat(order.toString()).toUpperCase()
            return Course.create({
                course_code,
                course_name,
                dep_code,
                departmentId
            });
            
        }
        let order = parseInt(result[0].course_code.split('_')[1]);
        const course_code = 'CO_00'.concat((++order).toString()).toUpperCase();
        return Course.create({
            course_code,
            course_name,
            dep_code,
            departmentId
        });
    }).then(result => {
        req.flash('success', 'Course created successfully');
        res.redirect('/admin/registerCourse');
    }).catch(err => {
        req.flash('error', 'Something went wrong with Course creation.Please try again');
        res.redirect('/admin/registerCourse');
        console.log(err);

    });


}

exports.postDeleteCourse = (req,res,next) => {
    Course.findByPk(parseInt(req.body.course_id))
    .then(record => {
        if(record){
            req.flash('success', 'Course removed successfully')
            res.redirect('/admin/registerCourse')
            return record.destroy();
        }
        return 'error destroying field';
    }).then(msg => {
        req.flash('error', msg);
    }).catch(err =>{
        req.flash('error', 'error removing Course');
        console.log(err)
    })
}

/**
 * registerStaff
 */

exports.getRegisterStaff = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allDepartments = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Department.findAll({raw:true})
    .then(departments => {
        allDepartments = departments;
        return Staff.findAll({raw:true})
    
    }).then(allStaff => {
        res.render('admin/registerStaff', {
            pageTitle:'Register Staff',
            allStaff,
            allDepartments,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterStaff = (req,res,next) => {
    const selectedDepartment =  req.body.selectDepartmentStaff;
    const staff_name = req.body.staff_name;
    const staff_email = req.body.staff_email;
    const staff_password = req.body.staff_password;
    let dep_code = '';
    let departmentId = '';
    let payroll_no_2 = 0;
    let hashedPassword = '';


    if(!selectedDepartment || selectedDepartment == ' '){
        req.flash('error', 'please provide valid department data');
        return res.redirect('/admin/registerStaff');
    }
    if(!staff_name || staff_name == ' '){
        req.flash('error', 'please provide valid staff name');
        return res.redirect('/admin/registerStaff');
    }
    if(!staff_email || staff_email == ' '){
        req.flash('error', 'please provide valid staff email');
        return res.redirect('/admin/registerStaff');
    }
    if(!staff_password || staff_password == ' '){
        req.flash('error', 'please provide valid staff password');
        return res.redirect('/admin/registerStaff');
    }
    Department.findOne({where:{dep_name:selectedDepartment}})
    .then(department => {
        dep_code = department.dep_code
        departmentId = department.id
    }).catch(err => {
        console.log(err)
    });

    Staff.findOne({where:{email:staff_email}})
    .then(staff => {
        if(staff){
            payroll_no_2 = parseInt(staff.payroll_no);
        }
    }).catch(err=> {
        console.log(err);
    });

    bcrypt.hash(staff_password, 12)
    .then(passwd => {
        hashedPassword = passwd;
    }).catch(err => {
        console.log(err)
    });

    Staff.findAll({raw:true})
    .then(staff => {
        if (staff.length == 0){ // no db records so no duplicates
            return Staff.findAll({
                order:[['createdAt','DESC']]
            });
        }else if( (
            staff.filter((data) => {
                return data.email.toLowerCase() == staff_email.toLowerCase() && payroll_no_2
            })).length == 0 ) {
                return Staff.findAll({
                    order:[['createdAt','DESC']]
            });
        } else{
            req.flash('error', 'Staff already exists');
            return res.redirect('/admin/registerStaff');
        }
    })
    .then(result =>{
        if(result.length == 0){
            const payroll_no = 100;         
                return Staff.create({
                    name:staff_name,
                    email:staff_email,
                    password:hashedPassword,
                    payroll_no,
                    dep_code,
                    departmentId
                });
        }
        
        const payroll_no = ++result[0].payroll_no
        return Staff.create({
            name:staff_name,
            email:staff_email,
            password:hashedPassword,
            payroll_no,
            dep_code,
            departmentId
        });
    }).then(result => {
        req.flash('success', 'Staff created successfully');
        res.redirect('/admin/registerStaff');
    }).catch(err => {
        req.flash('error', 'Something went wrong with Staff creation.Please try again');
        res.redirect('/admin/registerStaff');
        console.log(err);

    });


}

exports.postDeleteStaff = (req,res,next) => {
    Staff.findByPk(parseInt(req.body.staff_id))
    .then(record => {
        if(record){
            req.flash('success', 'staff removed successfully')
            res.redirect('/admin/registerStaff')
            return record.destroy();
        }
        return 'error destroying field';
    }).then(msg => {
        req.flash('error', msg);
    }).catch(err =>{
        req.flash('error', 'error removing staff');
        console.log(err)
    })
}

/**
 * registerStudent
 */

exports.getRegisterStudent = (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allCourses = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Course.findAll({raw:true})
    .then(course => {
        allCourses = course;
        return Student.findAll({raw:true})
    
    }).then(allStudents => {
        res.render('admin/registerStudent', {
            pageTitle:'Register Student',
            allStudents,
            allCourses,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterStudent = (req,res,next) => {
    const selectedCourse =  req.body.selectCourseStudent;
    const student_name = req.body.student_name;
    const student_email = req.body.student_email;
    const student_password = req.body.student_password;
    let course_code = '';
    let courseId = '';
    let reg_no_2 = '';
    let hashedPassword = '';

    if(!selectedCourse || selectedCourse == ' '){
        req.flash('error', 'please provide valid course data');
        return res.redirect('/admin/registerStudent');
    }
    if(!student_name || student_name == ' '){
        req.flash('error', 'please provide valid student name');
        return res.redirect('/admin/registerStudent');
    }
    if(!student_email || student_email == ' '){
        req.flash('error', 'please provide valid student email');
        return res.redirect('/admin/registerStudent');
    }
    if(!student_password || student_password == ' '){
        req.flash('error', 'please provide valid student password');
        return res.redirect('/admin/registerStudent');
    }
    Course.findOne({where:{course_name:selectedCourse}})
    .then(course => {
        course_code = course.course_code
        courseId = course.id
    }).catch(err => {
        console.log(err)
    });

    Student.findOne({where:{email:student_email}})
    .then(student => {
        if(student){
            reg_no_2 = student.reg_no;
        }
    }).catch(err => {
        console.log(err)
    })

    bcrypt.hash(student_password, 12)
    .then(hashpwd => {
        hashedPassword = hashpwd;
    }).catch(err => {
        console.log(err)
    });

    Student.findAll({raw:true})
    .then(student => {
        if (student.length == 0){ // no db records so no duplicates
            return Student.findAll({
                order:[['createdAt','DESC']]
            })
        }else if( (
            student.filter((data) => {
                return data.email.toLowerCase() == student_email.toLowerCase() && reg_no_2
            })).length == 0 ) {
                return Student.findAll({
                    order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'student already exists');
            return res.redirect('/admin/registerStudent');
        }
    })
    .then(result =>{
        if(result.length == 0){
            year = new Date().getFullYear()
            let reg_no = course_code+'/'+(100).toString()+'/'+year.toString();     
                return Student.create({
                    name:student_name,
                    email:student_email,
                    password:hashedPassword,
                    reg_no,
                    course_code,
                    courseId
                });
        }

        year = new Date().getFullYear()
        incrementedNumber = (parseInt(result[0].reg_no.split('/')[1])) + 1
        let reg_no = course_code+'/'+ incrementedNumber.toString() +'/'+year.toString();
        return Student.create({
            name:student_name,
            email:student_email,
            password:hashedPassword,
            reg_no,
            course_code,
            courseId
        });

    }).then(result => {
        req.flash('success', 'student created successfully');
        res.redirect('/admin/registerStudent');
    }).catch(err => {
        req.flash('error', 'Something went wrong with student creation.Please try again');
        res.redirect('/admin/registerStudent');
        console.log(err);

    });


}

exports.postDeleteStudent = (req,res,next) => {
    Student.findByPk(parseInt(req.body.student_id))
    .then(record => {
        if(record){
            req.flash('success', 'student removed successfully')
            res.redirect('/admin/registerStudent')
            return record.destroy();
        }
        return 'error destroying field';
    }).then(msg => {
        req.flash('error', msg);
    }).catch(err =>{
        req.flash('error', 'error removing student');
        console.log(err)
    })
}

/**
 * registerUnit
 */

exports.getRegisterUnit= (req, res, next) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    let allCourses = [];
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    Course.findAll({raw:true})
    .then(course => {
        allCourses = course;
        return Unit.findAll({raw:true})
    
    }).then(allUnits => {
        res.render('admin/registerUnits', {
            pageTitle:'Register Unit',
            allUnits,
            allCourses,
            errorMessage,
            success

        });
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postRegisterUnit = (req,res,next) => {
    const selectedCourseForUnit =  req.body.selectCourseForUnit;
    const unit_name = req.body.unit_name;
    let course_code = '';
    let courseId = '';


    if(!selectedCourseForUnit || selectedCourseForUnit == ' '){
        req.flash('error', 'please provide valid Unit data');
        return res.redirect('/admin/registerUnit');
    }
    if(!unit_name || unit_name == ' '){
        req.flash('error', 'please provide valid unit data');
        return res.redirect('/admin/registerUnit');
    }

    Course.findOne({where:{course_name:selectedCourseForUnit}})
    .then(course => {
        course_code = course.course_code
        courseId = course.id
    }).catch(err => {
        console.log(err)
    });


    Unit.findOne({where: {unit_name:unit_name}})
    .then(unit => {
        if(unit){
            req.flash('error', 'Unit already exists');
            return res.redirect('/admin/registerUnit');
        }
        return Unit.findAll({raw:true})

    }).then(unit => {
        if (unit.length == 0){ // no db records so no duplicates
            return Unit.findAll({
                order:[['createdAt','DESC']]
            })
        }else if(
            (unit.filter((data) => {
            return data.unit_name.toLowerCase() === unit_name.toLowerCase();
        })).length == 0) {
            return Unit.findAll({
                order:[['createdAt','DESC']]
            })
        } else{
            req.flash('error', 'Unit already exists');
            return res.redirect('/admin/registerUnit');
        }
    })
    .then(result =>{
        if(result.length == 0){
            let order = 1;
            const unit_code = 'UN_00'.concat(order.toString()).toUpperCase()
            return Unit.create({
                unit_code,
                unit_name,
                course_code,
                courseId
            });
            
        }
        let order = parseInt(result[0].unit_code.split('_')[1]);
        const unit_code = 'UN_00'.concat((++order).toString()).toUpperCase();
        return Unit.create({
            unit_code,
            unit_name,
            course_code,
            courseId
        });
    }).then(result => {
        req.flash('success', 'Unit created successfully');
        res.redirect('/admin/registerUnit');
    }).catch(err => {
        req.flash('error', 'Something went wrong with unit creation.Please try again');
        res.redirect('/admin/registerUnit');
        console.log(err);

    });


}

exports.postDeleteUnit = (req,res,next) => {
    Unit.findByPk(parseInt(req.body.unit_id))
    .then(record => {
        if(record){
            req.flash('success', 'Unit removed successfully')
            res.redirect('/admin/registerUnit')
            return record.destroy();
        }
        return 'error destroying field';
    }).then(msg => {
        req.flash('error', msg);
    }).catch(err =>{
        req.flash('error', 'error removing Course');
        console.log(err)
    })
}

/**
 * assignUnits
 */
exports.getAssignUnit = (req, res, render) => {
    let msg = req.flash('error');
    let success = req.flash('success');
    if(msg.length > 0){
        errorMessage = msg[0];
    }else {
        errorMessage = [];
    }
    if(success.length > 0){
        success = success[0];
    }else {
        success = [];
    }
    let staff = {};

    Staff.findOne({
        where:{id:req.query.id},
        raw:true
    })
    .then(staffRecord => {
        staff = staffRecord;
        return Course.findAll({
            where:{departmentId:staffRecord.departmentId},
            raw:true
        });
    })
    .then(courses => {
        let ids =  courses.map(course => course.id);
        return Unit.findAll({
            where:{courseId: ids},
            raw:true
        });
    })
    .then(allUnits => {

        res.render('admin/assignUnits',{
            pageTitle:'Register Assign Units',
            allUnits,
            staff,
            success,
            errorMessage,
            client
        })

    }).catch(err => {
        console.log(err)
    })

    
}

exports.postAssignUnit =  (req,res,render) => {
    const staff_id = req.body.id
    const { selectedUnit } = req.body;

    let updateValues = {assignedUnits: selectedUnit ? selectedUnit : [] };


    
    Staff.findByPk(staff_id)
    .then(staff => {
        return staff.update(updateValues)
    }).then(rows => {
        req.flash('success', 'updated units')
        res.redirect('/admin/assignUnits?id=2')
        console.logs(rows)
    }).catch(err => {
        req.flash('error', 'updating units failed')
        res.redirect('/admin/assignUnits?id=2')
        console.log(err)
    })

}
