'use strict';
module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
    name: DataTypes.STRING(64),
    code: DataTypes.INTEGER
  }, {
    paranoid:true,
    timestamps:true
  });
  Region.associate = function(models) {
    // associations can be defined here
    // Region hasMany(models.Proinvce)
    Region.hasMany(models.Province, {foreignKey:'regionId'});
  };
  return Region;
};
