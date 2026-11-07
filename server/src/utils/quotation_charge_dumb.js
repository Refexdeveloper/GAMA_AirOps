const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuotationCharge extends Model {
    static associate(models) {
      QuotationCharge.belongsTo(models.Quotation, {
        foreignKey: "quotation_id",
        as: "quotation",
      });
    }
  }
  QuotationCharge.init(
    {
      quotation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "QuotationCharge",
    }
  );
  return QuotationCharge;
};
