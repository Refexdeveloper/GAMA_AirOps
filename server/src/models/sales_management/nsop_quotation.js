const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class NSOPQuotation extends Model {
    static associate(models) {
      NSOPQuotation.hasMany(models.NSOPQuotationTrips, {
        foreignKey: "quotation_id",
        as: "trips",
      });
      // NSOPQuotation.belongsTo(models.MastersAircraft, {
      //   foreignKey: "aircraft_id",
      //   as: "aircraft",
      // });
      NSOPQuotation.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "allocatee",
      });
      NSOPQuotation.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      NSOPQuotation.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  NSOPQuotation.init(
    {
      customer_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      aircraft_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      aircraft_pax: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      manufacture_year: {
        type: DataTypes.STRING(10),
      },
      price: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
      aircraft_image: {
        type: DataTypes.STRING(100),
      },
      interior_image: {
        type: DataTypes.STRING(100),
      },
      lopa_image: {
        type: DataTypes.STRING(100),
      },
      cabin_image: {
        type: DataTypes.STRING(100),
      },
      type: {
        type: DataTypes.ENUM("oneway", "roundtrip", "multicity"),
        defaultValue: "oneway",
      },
      // aircraft_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // per_hour_cost: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // duration: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // trip_cost: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      // sub_total: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      // discount: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      // st_after_discount: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      // gst: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      // grand_total: {
      //   type: DataTypes.FLOAT(12, 2),
      //   allowNull: false,
      // },
      file_name: {
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
      modelName: "NSOPQuotation",
      tableName: "nsop_quotations",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return NSOPQuotation;
};
