const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class LeadTrip extends Model {
    static associate(models) {
      LeadTrip.belongsTo(models.Lead, {
        foreignKey: "lead_id",
        as: "lead",
      });
      LeadTrip.belongsTo(models.MastersAirport, {
        foreignKey: "departure_airport_id",
        as: "departure_airport",
      });
      LeadTrip.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_airport_id",
        as: "arrival_airport",
      });
    }
  }
  LeadTrip.init(
    {
      lead_id: {
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
      modelName: "LeadTrip",
      timestamps: false,
    }
  );
  return LeadTrip;
};
