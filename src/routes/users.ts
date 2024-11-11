import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  getUserById,
  getUserData,
  getUsers,
  updateAvatar,
  updateUserData
} from "../controllers/users";
import { validateBody, validateObjId } from "../middleware/validation";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get(
  "/me",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().messages({
          "any.required": 'Не указан заголовок "authorization"'
        })
      })
      .unknown(true)
  }),
  getUserData
);
userRouter.get("/:userId", validateObjId, getUserById);
userRouter.patch("/me", validateBody, updateUserData);
userRouter.patch("/me/avatar", validateBody, updateAvatar);

export default userRouter;
