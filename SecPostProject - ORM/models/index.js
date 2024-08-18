const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql', 
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Post = require('./post')(sequelize, DataTypes);

// Örnek ilişkiler
db.User.hasMany(db.Post, { foreignKey: 'author_id' });
db.Post.belongsTo(db.User, { foreignKey: 'author_id' });

module.exports = db;
