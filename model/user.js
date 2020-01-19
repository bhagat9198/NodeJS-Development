// There will be one dummy user who can add items in cart and later can checkout. 

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define(user, {
  id : {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: Sequelize.INTEGER
  },
  name : {
    type: Sequelize.STRING,
    allowNull: false
  },
  email : {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;