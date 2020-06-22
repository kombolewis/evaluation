const bcrypt = require('bcryptjs');
const Staff = require('../../models/staff');


exports.getLogin = (req, res, next) =>{
    let msg = req.flash('error');
    let success = req.flash('error');
    if(msg.length > 0){
        msg = msg[0];
    } 
    if(success.length > 0){
        success = success[0];
    }
    res.render('staff/auth/Login',{
        pageTitle:'Login',
        errorMessage: msg,
        success: success
    });
}

exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    Staff.findOne({ where: {email:email}})
    .then(staff => {
        if(!staff){
            req.flash('error', 'User not found');
            return res.redirect('/staff/login');
        }
        bcrypt.compare(password, staff.password)
        .then(match => {
            if(match){
                req.session.isLoggedIn = true;
                req.session.staff = staff;
                return req.session.save(err =>{
                    console.log(err)
                    res.redirect('/staff/');
                    req.flash('success', 'Successfully Logged in.');


                })
            }
            req.flash('error', 'Invalid Email or Password');
            res.redirect('/staff/login');
        }).catch(err => {
            console.log(err);
        });
    })
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) =>{
        res.redirect('/staff/login');
        console.log(err)
    });
}

