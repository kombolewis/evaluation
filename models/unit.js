const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Unit = sequelize.define('unit', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    unit_code:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    unit_name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    course_code:{
        type: Sequelize.STRING,
        references: {
            model:'courses', 
            key: 'course_code',
        }
    }
});

module.exports = Unit;