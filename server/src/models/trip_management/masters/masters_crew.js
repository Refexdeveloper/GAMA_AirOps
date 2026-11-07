const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersCrew extends Model {
    static associate(models) {
      MastersCrew.belongsTo(models.MastersOperator, {
        foreignKey: "operator_id",
        as: "operator",
      });
      MastersCrew.belongsTo(models.MastersAirport, {
        foreignKey: "arrival_at",
        as: "last_arrival_airport",
      });
      MastersCrew.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      MastersCrew.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater",
      });
    }
  }
  MastersCrew.init(
    {
      operator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      on_duty_as: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
      },
      mobile_no: {
        type: DataTypes.STRING(10),
      },
      email: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.DATEONLY,
      },
      passport: {
        type: DataTypes.STRING,
      },
      doj: {
        type: DataTypes.DATEONLY,
      },
      not_in_service: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      not_in_service_from: DataTypes.DATE,
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        defaultValue: "Male",
      },
      last_flight_on: {
        type: DataTypes.DATE,
      },
      arrival_at: {
        type: DataTypes.INTEGER,
      },
      applicable_models: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      applicable_critical_airports: {
        type: DataTypes.JSON,
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
      modelName: "MastersCrew",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MastersCrew;
};
