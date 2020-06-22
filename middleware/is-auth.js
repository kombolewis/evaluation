exports.isAuthStudent= (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/student/login');
    }
    next();
}

exports.isAuthStaff= (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/staff/login');
    }
    next();
}

exports.isAuthAdmin= (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/admin/login');
    }
    next();
}