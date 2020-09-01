//Model for the teams. They have a name, are tied to a user ID, and have a list of members (a JSON string)
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    realm: {
      type: DataTypes.STRING,
      allowNull: false
    },
    members: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  //Each Team is owned by one User. A User can have multiple Teams.
  Team.associate = function(models) {
    Team.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Team;
}

