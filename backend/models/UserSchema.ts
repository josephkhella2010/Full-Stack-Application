import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const UserSchema = {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255] as const,
    },
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255] as const,
    },
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9_]+$/,
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  // Firebase Authentication user ID
  firebaseUid: {
    type: DataTypes.STRING(128),
    allowNull: true,
    unique: true,
    field: "firebaseUid",
  },

  // Firebase manages passwords, not PostgreSQL
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

export const User = sequelize.define("User", UserSchema, {
  tableName: "users",
  timestamps: true,
  underscored: true,
});
