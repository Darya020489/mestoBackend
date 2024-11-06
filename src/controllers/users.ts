import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { Error as MongooseError } from "mongoose";
import User from "../models/user";
import NotFoundError from "../errors/notFoundError";
import ConflictError from "../errors/conflictError";
import BadRequestError from "../errors/badRequestError";
import { AuthContext } from "../types/authContext";
// http://localhost:3000/users

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  console.log("getUsers!!!!!");
  try {
    const users = await User.find({});
    console.log(users);
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  console.log(userId, "getUser!!!!!");
  try {
    const user = await User.findOne({ _id: Object(userId) }).orFail(
      () => new NotFoundError("Пользователь не найден")
    );
    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(new BadRequestError("Невалидный id"));
    }
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body, "req.body");
  const { name, about, avatar } = req.body;
  console.log(name, about, avatar, "createUser!!!!!");
  try {
    const newUser = await User.create(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.startsWith("E11000")) {
      return next(new ConflictError("Имя уже используется"));
    }
    return next(error);
  }
};

export const updateUserData = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const { name, about } = req.body;
  console.log(name, about, "updateUserData!!!!!!");
  // const { _id } = res.locals.user;
  const { _id } = req.user;
  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: Object(_id) },
      { $set: { name, about } },
      {
        returnDocument: "after",
        runValidators: true
      }
    ).orFail(() => new NotFoundError("Пользователь не найден"));
    return res.status(200).send(updateUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const { avatar } = req.body;
  console.log(avatar, "updateAvatar!!!!!!");
  // const { _id } = res.locals.user;
  const { _id } = req.user;
  try {
    const updateUserAvatar = await User.findOneAndUpdate(
      { _id: Object(_id) },
      { $set: { avatar } },
      { returnDocument: "after", runValidators: true }
    ).orFail(() => new NotFoundError("Пользователь не найден"));
    return res.status(200).send(updateUserAvatar);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};
