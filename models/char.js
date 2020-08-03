module.exports = function(sequelize, DataTypes) {
  var Character = sequelize.define("Character", {
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clss: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  /*Character.associate = function(models) {
    Character.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };*/

  return Character;
}