const bcrypt = require('bcryptjs');
const Student = require('../models/student');

exports.getLogin = (req, res, next) =>{
    
    return res.redirect('/admin/login');

    let msg = req.flash('error');
    let success = req.flash('error');

    if(msg.length > 0){
        msg = msg[0];
    } 
    if(success.length > 0){
        success = success[0];
    }


    res.render('auth/Login',{
        pageTitle:'Login',
        greet: 'Hello There',
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
            return res.redirect('/login');
        }
        bcrypt.compare(password, student.password)
        .then(match => {
            if(match){
                req.session.isLoggedIn = true;
                req.session.student = student;
                return req.session.save(err =>{
                    console.log(err)
                    res.redirect('/');
                    req.flash('success', 'Successfully Logged in.');


                })
            }
            req.flash('error', 'Invalid Email or Password');
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
        });
    })
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) =>{
        res.redirect('/login');
        console.log(err)
    });
}

exports.getRegister = (req, res, next) =>{
    res.render('auth/Register',{
        pageTitle:'Register'
    })
}

exports.postRegister = (req, res, next) =>{
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmpassword = req.body.password2;
    Student.findOne({ where: { email: email } })
    .then(student => {
        if(student){
            return res.redirect('/register');
        }
        return bcrypt
        .hash(password, 12)
        .then(hashPassword => {
            return Student.create({
                name,
                email,
                password:hashPassword
            });
        })
        .then(result => {
            res.redirect('/login');
        });

    }).catch(err => {
        console.log(err);
    });
}