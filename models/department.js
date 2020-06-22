const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Department = sequelize.define('department', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    dep_code:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    dep_name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    fac_code:{
        type: Sequelize.STRING,
        references: {
            model:'faculties', 
            key: 'fac_code',
        }
    }
});

module.exports = Department;