import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { Error as MongooseError } from "mongoose";
import Card from "../models/card";
import NotFoundError from "../errors/notFoundError";
import BadRequestError from "../errors/badRequestError";
import { AuthContext } from "../types/authContext";
import ForbiddenError from "../errors/forbiddenError";

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  console.log("getCards!!!!!");
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const userId = res.locals.user?._id;
  // console.log(userId);
  const { name, link } = req.body;
  console.log(name, link, "createCard!!!!");
  try {
    const newCard = await Card.create({
      name,
      link,
      owner: { _id: Object(userId) }
    });
    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const userId = res.locals.user?._id;
  const { cardId } = req.params;
  console.log(userId, cardId, "deleteCard!!!!!");
  try {
    const currentCard = await Card.findOne({ _id: Object(cardId) }).orFail(
      () => new NotFoundError("Карта не найдена")
    );
    if (userId !== String(currentCard.owner)) {
      return next(new ForbiddenError("Запрещено удалять чужую карту"));
    }
    const deletedCard = await Card.findOneAndDelete({ _id: Object(cardId) });
    return res.status(200).send(deletedCard);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(new BadRequestError("Невалидный id"));
    }
    return next(error);
  }
};

export const likeCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const userId = res.locals.user?._id;
  const { cardId } = req.params;
  console.log(cardId, "likeCard!!!!!");
  try {
    const likedCard = await Card.findByIdAndUpdate(
      Object(cardId),
      { $addToSet: { likes: { _id: Object(userId) } } }, // добавить _id в массив, если его там нет
      { new: true }
    )
      // .populate(["owner", "likes"])
      .orFail(() => new NotFoundError("Карта не найдена"));
    return res.status(200).send(likedCard);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(new BadRequestError("Невалидный id"));
    }
    return next(error);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction
) => {
  const userId = res.locals.user?._id;
  const { cardId } = req.params;
  console.log(cardId, "dislikeCard!!!!!");
  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      Object(cardId),
      { $pull: { likes: Object(userId) } }, // убрать _id из массива
      { new: true }
    )
      // .populate(["owner", "likes"])
      .orFail(() => new NotFoundError("Карта не найдена"));
    return res.status(200).send(dislikedCard);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(new BadRequestError("Невалидный id"));
    }
    return next(error);
  }
};
