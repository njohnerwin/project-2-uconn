module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    members: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
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

