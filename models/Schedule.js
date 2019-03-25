'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    name: DataTypes.STRING,
    timeIn: DataTypes.STRING,
    timeOut: DataTypes.STRING
  }, {paranoid: true, timeStamps: true});
  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Jeepney, {foreignKey: 'jeepneyId'});
    Schedule.hasMany(models.Driver, {foreignKey: 'scheduleId'});

  };
  return Schedule;
};