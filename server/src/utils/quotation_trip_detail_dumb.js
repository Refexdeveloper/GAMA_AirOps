const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuotationTripDetail extends Model {
    static associate(models) {
      QuotationTripDetail.belongsTo(models.Quotation, {
        foreignKey: "quotation_id",
        as: "quotation",
      });
      QuotationTripDetail.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      QuotationTripDetail.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  QuotationTripDetail.init(
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
    },
    {
      sequelize,
      modelName: "QuotationTripDetail",
      timestamps: false,
    }
  );
  return QuotationTripDetail;
};
