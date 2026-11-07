const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BriefSheetTripPassengers extends Model {
    static associate(models) {
      BriefSheetTripPassengers.belongsTo(models.BriefSheetTrips, {
        foreignKey: "trip_id",
        as: "trips",
      });
    }
  }
  BriefSheetTripPassengers.init(
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
      modelName: "BriefSheetTripPassengers",
      timestamps: false,
    }
  );
  return BriefSheetTripPassengers;
};
