const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuotationCharges extends Model {
    static associate(models) {
      QuotationCharges.belongsTo(models.Quotation, {
        foreignKey: "quotation_id",
        as: "quotation",
      });
    }
  }
  QuotationCharges.init(
    {
      quotation_id: {
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
      modelName: "QuotationCharges",
      timestamps: false,
    }
  );
  return QuotationCharges;
};
