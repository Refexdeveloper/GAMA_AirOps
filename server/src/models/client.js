const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Client.belongsTo(models.User, {
        foreignKey: "associate_user_id",
        as: "associate_user",
      });
      Client.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Client.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
      Client.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  Client.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4, // automatically generates UUID v4
        primaryKey: true,
      },
      name: DataTypes.STRING,
      secret: DataTypes.STRING(100),
      associate_user_id: {
        type: DataTypes.INTEGER,
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
      modelName: "Client",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return Client;
};
