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