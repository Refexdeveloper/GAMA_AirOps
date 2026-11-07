const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Quotation extends Model {
    static associate(models) {
      Quotation.belongsTo(models.MastersAircraftModel, {
        foreignKey: "aircraft_id",
        as: "aircraft_model",
      });
      Quotation.belongsTo(models.Quotation, {
        foreignKey: "customer_id",
        as: "customer",
      });
      Quotation.hasMany(models.QuotationTripDetail, {
        foreignKey: "quotation_id",
        as: "trip_details",
      });
      Quotation.hasMany(models.QuotationCharge, {
        foreignKey: "quotation_id",
        as: "charges",
      });
      Quotation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      Quotation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
    }
  }
  Quotation.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("oneway", "roundtrip", "multicity"),
        defaultValue: null,
      },
      remark: {
        type: DataTypes.STRING(255),
        defaultValue: null,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING(30),
        defaultValue: null,
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
      modelName: "Quotation",
    }
  );
  return Quotation;
};
