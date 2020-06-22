const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const College = sequelize.define('college', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    col_code:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    col_name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    }
});

module.exports = College;