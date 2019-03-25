'use strict';
module.exports = (sequelize, DataTypes) => {
  const Boundary = sequelize.define('Boundary', {
    amountGiven: DataTypes.INTEGER,
    targetAmount: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {paranoid: true, timeStamps: true});
  Boundary.associate = function(models) {
    Boundary.belongsTo(models.Driver, {foreignKey: 'driverId'});
  };
  return Boundary;
};