const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Faculty = sequelize.define('faculty', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    fac_code:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    fac_name:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    col_code:{
        type: Sequelize.STRING,
        references: {
            model:'colleges', 
            key: 'col_code',
        }
    }
});

module.exports = Faculty;