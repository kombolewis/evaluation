exports.getIndex = (req, res, next) =>{
    res.render('index',{
        pageTitle:'Home',
        greet: 'Hello There',
    });
}
