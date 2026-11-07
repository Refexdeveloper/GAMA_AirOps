const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class ProformaInvoiceTrips extends Model {
    static associate(models) {
      ProformaInvoiceTrips.belongsTo(models.ProformaInvoice, {
        foreignKey: "pi_id",
        as: "proforma_invoice",
      });
      ProformaInvoiceTrips.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      ProformaInvoiceTrips.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  ProformaInvoiceTrips.init(
    {
      pi_id: {
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
      //   pax: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //   },
      start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      cost: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProformaInvoiceTrips",
      timestamps: false,
    }
  );
  return ProformaInvoiceTrips;
};
