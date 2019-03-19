'use strict';
module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    name: DataTypes.STRING(64),
    code: DataTypes.INTEGER
  }, {
    paranoid:true,
    timestamps:true
  });
  Province.associate = function(models) {
    // associations can be defined here
    // Province belongsTo Region
    Province.belongsTo(models.Region, {foreignKey: 'regionId'});

    // Province hasManu Municipality
    Province.hasMany(models.Municipality, {foreignKey: 'provinceId'});
  };
  return Province;
};