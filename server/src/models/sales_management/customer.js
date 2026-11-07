const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Customer.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  Customer.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gst_no: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      meal_preference: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "Individual",
        values: ["Individual", "Company", "Proprietorship", "Partnership"],
      },
      company_name: {
        type: DataTypes.STRING,
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
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Customer;
};
