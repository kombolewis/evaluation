const Staff = require('../../models/staff');
const Student = require('../../models/student');
const Unit = require('../../models/unit');


exports.getIndex = (req,res,next) => {

    Staff.findByPk(req.session.staff.id, {raw:true})
    .then(staff => {
        res.render('staff/index', {
            pageTitle: 'Home',
            staff
        })
    })

}

exports.getAllStudents = (req, res, next) => {
    const unit = req.query.unit
    const myStudents = []

    Student.findAll({raw:true})
    .then(student => {
    
        const allStudents = student.filter(stud => {
            if(stud.currentUnits){
                return stud.currentUnits.split(';').filter(rec => {
                     if(rec == unit){
                         myStudents.push(stud)
                     }
                })
            }
        })
        

        res.render('staff/allstudents', {
            pageTitle:'All Students',
            myStudents,
            unit
        })
    })


}