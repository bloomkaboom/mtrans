'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    licenseNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {paranoid: true, timeStamps: true});
  Driver.associate = function(models) {
    Driver.belongsTo(models.Schedule, {foreignKey: 'scheduleId'});
    Driver.hasMany(models.Boundary, {foreignKey: 'driverId'});
  };
  return Driver;
};