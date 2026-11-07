const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class ProformaInvoiceCharges extends Model {
    static associate(models) {
      ProformaInvoiceCharges.belongsTo(models.ProformaInvoice, {
        foreignKey: "pi_id",
        as: "proforma_invoice",
      });
    }
  }
  ProformaInvoiceCharges.init(
    {
      pi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      cost: {
        type: DataTypes.FLOAT(12, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProformaInvoiceCharges",
      timestamps: false,
    }
  );
  return ProformaInvoiceCharges;
};
