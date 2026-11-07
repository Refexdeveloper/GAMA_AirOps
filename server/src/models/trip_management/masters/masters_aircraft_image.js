const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class MastersAircraftImage extends Model {
    static associate(models) {
      MastersAircraftImage.hasOne(models.MastersAircraftModel, {
        foreignKey: "image_id",
        onDelete: "CASCADE",
      });
    }
  }
  MastersAircraftImage.init(
    {
      aircraft_image_1: {
        type: DataTypes.STRING(255),
      },
      aircraft_image_2: {
        type: DataTypes.STRING(255),
      },
      aircraft_image_3: {
        type: DataTypes.STRING(255),
      },
      lopa_image: {
        type: DataTypes.STRING(255),
      },
      cabin_image: {
        type: DataTypes.STRING(255),
      },
      interior_image_1: {
        type: DataTypes.STRING(255),
      },
      interior_image_2: {
        type: DataTypes.STRING(255),
      },
      interior_image_3: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "MastersAircraftImage",
      timestamps: false,
    }
  );
  return MastersAircraftImage;
};
