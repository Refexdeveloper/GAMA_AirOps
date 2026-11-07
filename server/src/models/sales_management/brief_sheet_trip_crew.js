const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BriefSheetTripCrew extends Model {
    static associate(models) {
      BriefSheetTripCrew.belongsTo(models.BriefSheetTrips, {
        foreignKey: "trip_id",
        as: "trips",
      });
    }
  }
  BriefSheetTripCrew.init(
    {
      trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
       _order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    },
    {
      sequelize,
      modelName: "BriefSheetTripCrew",
      timestamps: false,
    }
  );
  return BriefSheetTripCrew;
};
