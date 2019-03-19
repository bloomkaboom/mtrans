'use strict';
module.exports = (sequelize, DataTypes) => {
  const Municipality = sequelize.define('Municipality', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER
  }, {
    paranoid:true,
    timestamps:true
  });
  Municipality.associate = function(models) {
    // associations can be defined here
    // Municipality belongsTo Province
    Municipality.belongsTo(models.Province, {foreignKey: 'provinceId'});
  };
  return Municipality;
};