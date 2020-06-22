const bcrypt = require('bcryptjs');
const Student = require('../../models/student');


exports.getLogin = (req, res, next) =>{
    let msg = req.flash('error');
    let success = req.flash('error');
    if(msg.length > 0){
        msg = msg[0];
    } 
    if(success.length > 0){
        success = success[0];
    }
    res.render('students/auth/Login',{
        pageTitle:'Login',
        errorMessage: msg,
        success: success
    });
}

exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    Student.findOne({ where: {email:email}})
    .then(student => {
        if(!student){
            req.flash('error', 'User not found');
            return res.redirect('/student/login');
        }
        return bcrypt.compare(password, student.password)
        .then(match => {
            if(match){
                req.session.isLoggedIn = true;
                req.session.student = student;
                return req.session.save(err =>{
                    console.log(err)
                    res.redirect('/student/');
                    req.flash('success', 'Successfully Logged in.');


                })
            }
            req.flash('error', 'Invalid Email or Password');
            res.redirect('/student/login');
        })
    }).catch(err => {
        console.log(err);
    });
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) =>{
        console.log(err)
        res.redirect('/student/login');
    });
}
