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

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 255] as const,
    },
  },
};

export const User = sequelize.define("User", UserSchema, {
  tableName: "users",
  timestamps: true,
  underscored: true,
});
