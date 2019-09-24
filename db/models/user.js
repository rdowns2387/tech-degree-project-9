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
      validate: {
        notNull: {
          msg: 'First Name is required.'
        },
        notEmpty: {
          msg: 'First Name is required.'
        }
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name is required.'
        },
        notEmpty: {
          msg: 'Last Name is required.'
        }
      },
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, { sequelize}); //same as {sequelize: sequelize}

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'student', // this is how you do an alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };


  return User;
};
