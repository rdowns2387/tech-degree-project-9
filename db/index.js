const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.User = require('./models/user.js')(sequelize);
db.models.Course = require('./models/course.js')(sequelize);

//associate user and course
db.models.Course.associate(db.models);
db.models.User.associate(db.models);

module.exports = db;
