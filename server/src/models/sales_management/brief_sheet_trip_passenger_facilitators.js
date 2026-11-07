const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BriefSheetTripPassengerFacilitators extends Model {
    static associate(models) {
      BriefSheetTripPassengerFacilitators.belongsTo(models.BriefSheetTrips, {
        foreignKey: "trip_id",
        as: "trips",
      });
    }
  }

  BriefSheetTripPassengerFacilitators.init(
    {
      trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      _order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BriefSheetTripPassengerFacilitators",
      timestamps: false,
    }
  );

  return BriefSheetTripPassengerFacilitators;
};

