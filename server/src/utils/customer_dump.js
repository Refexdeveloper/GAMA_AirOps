const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasOne(models.Quotation, {
        foreignKey: "customer_id",
        as: "quotation",
      });
      Customer.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "created_user",
      });
      Customer.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updated_user",
      });
    }
  }
  Customer.init(
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(10),
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
      modelName: "Customer",
    }
  );
  return Customer;
};
