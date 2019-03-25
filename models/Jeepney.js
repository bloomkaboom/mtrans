'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jeepney = sequelize.define('Jeepney', {
    plateNumber: DataTypes.STRING,
    route: DataTypes.STRING,
    coding: DataTypes.STRING,
    color: DataTypes.STRING,
    bodyType: DataTypes.STRING
  }, {paranoid: true, timeStamps: true});
  Jeepney.associate = function(models) {
    Jeepney.hasMany(models.Schedule, {foreignKey:'jeepneyId'});
  };
  return Jeepney;
};