'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    author_id: DataTypes.INTEGER,
  }, {
    timestamps: false, 
  });
  Post.associate = function(models) {
  };
  return Post;
};
