module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });

  Team.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Team.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Team;
}

