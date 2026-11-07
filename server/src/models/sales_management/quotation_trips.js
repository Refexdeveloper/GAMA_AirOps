const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuotationTrips extends Model {
    static associate(models) {
      QuotationTrips.belongsTo(models.Quotation, {
        foreignKey: "quotation_id",
        as: "quotation",
      });
      QuotationTrips.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      QuotationTrips.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  QuotationTrips.init(
    {
      quotation_id: {
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
      pax: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "QuotationTrips",
      timestamps: false,
    }
  );
  return QuotationTrips;
};
