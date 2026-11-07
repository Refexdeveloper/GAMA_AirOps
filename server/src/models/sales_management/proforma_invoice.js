const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class ProformaInvoice extends Model {
    static associate(models) {
      ProformaInvoice.hasMany(models.ProformaInvoiceTrips, {
        foreignKey: "pi_id",
        as: "trips",
      });
      ProformaInvoice.hasMany(models.ProformaInvoiceCharges, {
        foreignKey: "pi_id",
        as: "charges",
      });
      ProformaInvoice.belongsTo(models.Customer, {
        foreignKey: "bill_to",
        as: "customer",
      });
      ProformaInvoice.belongsTo(models.MastersAircraft, {
        foreignKey: "aircraft_id",
        as: "aircraft",
      });
      ProformaInvoice.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "allocatee",
      });
      ProformaInvoice.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      ProformaInvoice.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }

  ProformaInvoice.init(
    {
      bill_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      aircraft_reg_no: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      aircraft_model_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      hsn_sac: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "New",
        values: ["New", "Assigned", "Pending", "Paid", "Closed"],
      },
      file_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "ProformaInvoice",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ProformaInvoice;
};
