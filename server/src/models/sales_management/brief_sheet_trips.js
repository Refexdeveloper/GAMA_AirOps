const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BriefSheetTrips extends Model {
    static associate(models) {
      BriefSheetTrips.belongsTo(models.BriefSheet, {
        foreignKey: "sheet_id",
        as: "sheet",
      });
      BriefSheetTrips.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      BriefSheetTrips.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
      BriefSheetTrips.hasMany(models.BriefSheetTripPassengers, {
        foreignKey: "trip_id",
        as: "passengers",
      });
      BriefSheetTrips.hasMany(models.BriefSheetTripCrew, {
        foreignKey: "trip_id",
        as: "crew",
      });
      BriefSheetTrips.hasMany(models.BriefSheetTripPassengerFacilitators, {
        foreignKey: "trip_id",
        as: "passenger_facilitators",
      });
    }
  }
  BriefSheetTrips.init(
    {
      sheet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      departure_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      arrival_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gh_departure_airport: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gh_departure_airport_phone: {
        type: DataTypes.STRING,
      },
      gh_arrival_airport: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gh_arrival_airport_phone: {
        type: DataTypes.STRING,
      },
      start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      departure_address: {
        type: DataTypes.STRING,
      },
      arrival_address: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "BriefSheetTrips",
      timestamps: false,
    }
  );
  return BriefSheetTrips;
};
