const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class NSOPQuotationTrips extends Model {
    static associate(models) {
      NSOPQuotationTrips.belongsTo(models.NSOPQuotation, {
        foreignKey: "quotation_id",
        as: "nsop_quotation",
      });
      NSOPQuotationTrips.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      NSOPQuotationTrips.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  NSOPQuotationTrips.init(
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
      // cost: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
    },
    {
      sequelize,
      modelName: "NSOPQuotationTrips",
      tableName: "nsop_quotation_trips",
      timestamps: false,
    }
  );
  return NSOPQuotationTrips;
};
