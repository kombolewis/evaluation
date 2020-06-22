const Sequelize = require('sequelize');
const path = require('path');

// const sequelize = new Sequelize('school', 'kombo', '123456',{dialect:'mysql', host:'localhost'});

// const sequelize = new Sequelize('school', 'kombo', '123456',{dialect:'sqlite', host:'localhost'});


const sequelize = new Sequelize({
    host: 'localhost',
    dialect:'sqlite',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
    storage: path.join(__basedir, 'db.sqlite')
  });


module.exports = sequelize;


