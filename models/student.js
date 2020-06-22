const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Student = sequelize.define('student', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    reg_no:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    currentUnits: {
        type: Sequelize.STRING,
        //allowNull: false,
        get() {
            if(this.getDataValue('currentUnits')){
                return this.getDataValue('currentUnits').split(';')
            }
        },
        set(val) {
           this.setDataValue('currentUnits',val.join(';'));
        },
    },
    completedUnits: {
        type: Sequelize.STRING,
        // allowNull: false,
        get() {
            if(this.getDataValue('completedUnits')){
                return this.getDataValue('completedUnits').split(';')
            }
        },
        set(val) {
           this.setDataValue('completedUnits',val.join(';'));
        },
    },
    totalUnits: {
        type: Sequelize.STRING,
        // allowNull: false,
        get() {
            if(this.getDataValue('totalUnits')) {
                return this.getDataValue('totalUnits').split(';')
            }
        },
        set(val) {
           this.setDataValue('totalUnits',val.join(';'));
        },
    },
    course_code:{
        type: Sequelize.STRING,
        references: {
            model:'courses', 
            key: 'course_code',
        }
    }

})

module.exports = Student;