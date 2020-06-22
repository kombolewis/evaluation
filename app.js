const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
var SQLiteStore = require('connect-sqlite3')(session);
const csrf = require('csurf'); 
const flash = require('connect-flash');

global.__basedir = __dirname;


/**
 * routes 
 */
const adminRouter = require('./routes/admin')
const studentRoutes = require('./routes/student'); 
const staffRoutes = require('./routes/staff'); 

/**
 * db connection
 */

const sequelize = require('./utils/database');

/**
 * Models 
 */

const Staff = require('./models/staff');
const Course = require('./models/course');
const Student = require('./models/student');
const College = require('./models/college');
const Faculty = require('./models/faculty');
const Department = require('./models/department');
const Unit = require('./models/unit');
 

const app  = express();

const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'superssectet', 
    resave:false,
    saveUninitialized:false,
    store:new SQLiteStore
}));
app.use(csrfProtection);
app.use(flash());


app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin',adminRouter);
app.use('/student',studentRoutes);
app.use('/staff', staffRoutes);
app.use('/', staffRoutes);

College.hasMany(Faculty);
Faculty.hasMany(Department);
Department.hasMany(Course);
Department.hasMany(Staff);
Course.hasMany(Unit);
Course.hasMany(Student);




app.listen(9000);

// sequelize
// // .sync({force:true})
// .sync()
// .then(student =>{
//     // console.log(student);
//     app.listen(9000);
// })
// .catch(err => {
//     console.log(err)
// })