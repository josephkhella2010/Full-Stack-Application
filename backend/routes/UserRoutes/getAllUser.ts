import express from "express";
import { z } from "zod";
import { User } from "../../models/UserSchema.js";
import { userZodSchema } from "../../utilities/validation/userZodSchema.js";

const router = express.Router();

router.get("/users", async (_req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ["password"],
    },
  });

  const userResponseSchema = userZodSchema.omit({
    password: true,
  });

  const validationUser = z
    .array(userResponseSchema)
    .safeParse(users.map((user) => user.toJSON()));

  if (!validationUser.success) {
    return res.status(400).json({
      message: validationUser.error.issues.map((issue) => issue.message),
    });
  } else {
    return res.status(200).json({
      users: validationUser.data,
      message: ["Get users successfully"],
    });
  }
});

export default router;
