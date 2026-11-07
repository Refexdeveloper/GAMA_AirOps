const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Quotation extends Model {
    static associate(models) {
      Quotation.hasMany(models.QuotationTrips, {
        foreignKey: "quotation_id",
        as: "trips",
      });
      Quotation.hasMany(models.QuotationCharges, {
        foreignKey: "quotation_id",
        as: "charges",
      });
      Quotation.belongsTo(models.MastersAircraft, {
        foreignKey: "aircraft_id",
        as: "aircraft",
      });
      Quotation.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "allocatee",
      });
      Quotation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Quotation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  Quotation.init(
    {
      customer_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("oneway", "roundtrip", "multicity"),
        defaultValue: "oneway",
      },
      per_hour_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      trip_cost: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      sub_total: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      st_after_discount: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      gst: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      grand_total: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      is_simple: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "New",
        values: ["New", "Assigned", "In Progress", "Converted", "Closed"],
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
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Quotation;
};
