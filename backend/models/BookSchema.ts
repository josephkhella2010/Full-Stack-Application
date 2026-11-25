import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Book = sequelize.define(
  "Book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imgs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.STRING(128),
      allowNull: true,
      references: {
        model: "users",
        key: "firebaseUid",
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
    underscored: true,
  },
);
