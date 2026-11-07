const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BriefSheet extends Model {
    static associate(models) {
      BriefSheet.belongsTo(models.MastersAircraft, {
        foreignKey: "aircraft_id",
        as: "aircraft",
      });
      BriefSheet.hasMany(models.BriefSheetTrips, {
        foreignKey: "sheet_id",
        as: "trips",
      });
      BriefSheet.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      BriefSheet.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  BriefSheet.init(
    {
      customer_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      flight_manager: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      flight_manager_phone: {
        type: DataTypes.STRING,
      },
      operation_manager: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      operation_manager_phone: {
        type: DataTypes.STRING,
      },
      file_name: {
        type: DataTypes.STRING,
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
      modelName: "BriefSheet",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return BriefSheet;
};
