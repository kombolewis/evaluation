const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');


exports.getLogin = (req, res, next) =>{
    let msg = req.flash('error');
    let success = req.flash('error');
    if(msg.length > 0){
        msg = msg[0];
    } 
    if(success.length > 0){
        success = success[0];
    }
    res.render('admin/auth/Login',{
        pageTitle:'Login',
        errorMessage: msg,
        success: success
    });
}

exports.postLogin = (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({ where: {email:email}})
    .then(admin => {
        if(!admin){
            req.flash('error', 'User not found');
            return res.redirect('/admin/login');
        }
        bcrypt.compare(password, admin.password)
        .then(match => {
            if(match){
                req.session.isLoggedIn = true;
                req.session.admin = admin;
                return req.session.save(err =>{
                    console.log(err)
                    res.redirect('/admin/');
                    req.flash('success', 'Successfully Logged in.');


                })
            }
            req.flash('error', 'Invalid Email or Password');
            res.redirect('/admin/login');
        }).catch(err => {
            console.log(err);
        });
    })
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) =>{
        res.redirect('/admin/login');
    });
}

exports.getRegister = (req, res, next) =>{
    res.render('admin/auth/Register',{
        pageTitle:'Register'
    })
}

exports.postRegister = (req, res, next) =>{
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmpassword = req.body.password2;
    Admin.findOne({ where: { email: email } })
    .then(admin => {
        if(admin){
            req.flash('error', 'email already exists');
            return res.redirect('/admin/register');
        }
        return bcrypt
        .hash(password, 12)
        .then(hashPassword => {
            return Admin.create({
                name,
                email,
                password:hashPassword
            });
        })
        .then(result => {
            res.redirect('/admin/login');
        });

    }).catch(err => {
        console.log(err);
    });
}