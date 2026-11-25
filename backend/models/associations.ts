import { User } from "./UserSchema.js";
import { Book } from "./BookSchema.js";

User.hasMany(Book, {
  foreignKey: "userId",
  sourceKey: "firebaseUid",
  as: "books",
  onDelete: "CASCADE",
});

Book.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "firebaseUid",
  as: "user",
});
