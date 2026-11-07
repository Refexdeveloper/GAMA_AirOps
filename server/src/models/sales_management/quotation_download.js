const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuotationDownload extends Model {
    static associate(models) {

    }
  }
  QuotationDownload.init(
    {
      file_name: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "QuotationDownload",
      timestamps:false
    }
  );
  return QuotationDownload;
};
