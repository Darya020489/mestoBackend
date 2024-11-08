import { Router } from "express";
import {
  getUserById,
  getUserData,
  getUsers,
  updateAvatar,
  updateUserData
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/me", getUserData);
userRouter.get("/:userId", getUserById);
userRouter.patch("/me", updateUserData);
userRouter.patch("/me/avatar", updateAvatar);

export default userRouter;
