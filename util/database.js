// proper and nomal way
// const Sequelize = require('sequelize');

// this is buggy, using to get intellisense working
const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('nodeapp', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost' 
});

module.exports = sequelize;



