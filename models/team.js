module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });

  Team.associate = function(models) {
    Team.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Team;
}

