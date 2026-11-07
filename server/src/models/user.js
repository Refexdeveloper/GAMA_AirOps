const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Quotation, { foreignKey: "created_by" });
      User.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      User.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
      User.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  User.init(
    {
      full_name: DataTypes.STRING,
      // last_name: DataTypes.STRING,
      email: DataTypes.STRING(100),
      phone: DataTypes.STRING(20),
      // user_name: DataTypes.STRING(50),
      password: DataTypes.STRING(100),
      photo: DataTypes.STRING(100),
      api_key: DataTypes.TEXT,
      role: DataTypes.STRING(10),
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
      deleted_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return User;
};
