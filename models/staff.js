const Sequelize = require('sequelize');

const sequelize = require('../utils/database');


const Staff = sequelize.define('staff', {
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
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    payroll_no:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true

    },
    assignedUnits: {
        type: Sequelize.STRING,
        allowNull: true,
        get() {
            return this.getDataValue('assignedUnits').split(';')
        },
        set(val) {
           this.setDataValue('assignedUnits',val.join(';'));
        },
    },
    dep_code:{
        type: Sequelize.STRING,
        references: {
            model:'departments', 
            key: 'dep_code',
        }
    }
})

module.exports = Staff;