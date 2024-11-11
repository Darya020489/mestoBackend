import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { Error as MongooseError } from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user";
import NotFoundError from "../errors/notFoundError";
import ConflictError from "../errors/conflictError";
import BadRequestError from "../errors/badRequestError";
import { AuthContext } from "../types/authContext";
import "dotenv/config";
// http://localhost:3000/users

const {
  NODE_ENV = "production",
  JWT_SECRET = "eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b"
} = process.env;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(email, password, "login!!!!!");
  try {
    const currentUser = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: currentUser._id }, // Пейлоуд токена — зашифрованный в строку объект пользователя
      NODE_ENV === "production" ? (JWT_SECRET as string) : "dev-secret-key", // секретный ключ, которым этот токен был подписан
      { expiresIn: "7d" } // токен будет просрочен через 7 дней после создания
    );
    // res.cookie("jwt", token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end();
    res.setHeader("Set-Cookie", `${token}; HttpOnly`);
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body, "createUser!!!!!");
  try {
    const newUser = await User.create({
      ...req.body
    });
    const cleanUser = newUser.toJSON();
    return res.status(constants.HTTP_STATUS_CREATED).send(cleanUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.startsWith("E11000")) {
      return next(new ConflictError("email уже используется"));
    }
    return next(error);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  console.log("getUsers!!!!!");
  try {
    const users = await User.find({});
    // console.log(users);
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    console.log(userId, "getUser!!!!!");
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

export const getUserData = async (
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user?._id;
    console.log(userId, "getUserData!!!!!");
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

export const updateUserData = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const userId = res.locals.user?._id;
  console.log(userId, req.body, "updateUserData!!!!!!");
  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: Object(userId) },
      { $set: req.body },
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
  const userId = res.locals.user?._id;
  const { avatar } = req.body;
  console.log(userId, avatar, "updateAvatar!!!!!!");
  try {
    const updateUserAvatar = await User.findOneAndUpdate(
      { _id: Object(userId) },
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
