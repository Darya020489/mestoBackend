import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateUserData
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/me", updateUserData);
userRouter.patch("/me/avatar", updateAvatar);

export default userRouter;
