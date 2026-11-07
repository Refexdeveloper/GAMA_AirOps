const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Lead extends Model {
    static associate(models) {
      Lead.hasMany(models.LeadTrip, {
        foreignKey: "lead_id",
        as: "trip",
      });
      Lead.belongsTo(models.MastersAircraftModel, {
        foreignKey: "aircraft_id",
        as: "aircraft",
      });
      Lead.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Lead.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  Lead.init(
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "oneway",
        values: ["oneway", "roundtrip", "multicity"],
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "New",
        values: ["New", "Assigned", "In Progress", "Converted", "Closed"],
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Lead",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Lead;
};
