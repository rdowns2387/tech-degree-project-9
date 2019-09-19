'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, { sequelize });

  // User.associate = (models) => {
  //   User.belongsTo(models.Person, {
  //     as: 'director', // this is an alias
  //     foreignKey: {
  //       fieldName: 'directorPersonId',
  //       allowNull: false,
  //     },
  //   });
  // };

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'courses', // this is how you do an alias
      foreignKey: {
        fieldName: 'id',
        allowNull: false,
      },
    });
  };

  return User;
};
