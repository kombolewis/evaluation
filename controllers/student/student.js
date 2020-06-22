const Student =  require('../../models/student')
const Unit =  require('../../models/unit')
const client =  require('./client')

exports.getIndex = (req, res, next) =>{
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
    Student.findByPk(req.session.student.id, {raw:true})
    .then(student => {
        res.render('students/index',{
            pageTitle:'Home',
            student,
            errorMessage,
            success
        });
    })


}

exports.getRegisterUnits = (req, res, next) => {
    let student = {}
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
    Student.findByPk(req.session.student.id,{raw:true})
    .then(newstudent => {
        student = newstudent;
        return Unit.findAll({where:{courseId:student.courseId}, raw:true})
  
    })
    .then(allUnits => {
        res.render('students/registerUnits', {
            pageTitle:'Register Units',
            allUnits,
            student,
            errorMessage,
            success,
            client
        })
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postRegisterUnit =  (req,res,render) => {
    const { selectedUnit } = req.body;
    let updateValues = {currentUnits: selectedUnit ? selectedUnit : [] };

    Student.findByPk(req.session.student.id)
    .then(student => {
        return student.update(updateValues)
    })
    .then(rows => {
        console.log(rows)
        req.flash('success', 'successfully registered units')
        res.redirect('/student/registerUnits')
    }).catch(err => {
        req.flash('error', 'registering units failed')
        res.redirect('/student/registerUnits')
        console.log(err)
    })

}