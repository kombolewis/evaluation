const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Course = sequelize.define('course', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    course_code:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    course_name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    dep_code:{
        type: Sequelize.STRING,
        references: {
            model:'departments', 
            key: 'dep_code',
        }
    }
});

module.exports = Course;