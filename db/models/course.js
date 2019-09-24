const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    estimatedTime: {
      type: Sequelize.INTEGER,
    },
    materialsNeeded: {
      type: Sequelize.INTEGER,
    },
  }, { sequelize }); //same as {sequelize: sequelize}

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  module.exports = Course;
  return Course;
};
