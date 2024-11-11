import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import BadRequestError from "../errors/badRequestError";
import { emailPattern, urlPattern } from "../patterns/patterns";
import NotFoundError from "../errors/notFoundError";

// валидация userId
const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string()
      .required()
      .custom((value, helpers) => {
        console.log("валидация user id!!!!!!!!!!!!!!");
        if (Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ custom: "Невалидный id!" });
      })
  })
});

// валидация cardId
const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .required()
      .custom((value, helpers) => {
        console.log("валидация card id!!!!!!!!!!!!!!");
        if (Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ custom: "Невалидный id!" });
      })
  })
});

// валидация params
export const validateObjId = (req: Request, _res: Response, next: NextFunction) => {
  const param = Object.keys(req.params)[0];
  console.log(param, "param!!!!!!!!!!!!");
  switch (param) {
    case "cardId":
      return validateCardId(req, _res, next);
    case "userId":
      return validateUserId(req, _res, next);
    default:
      return next(new BadRequestError("Невалидный id"));
  }
};

// eslint-disable-next-line spaced-comment
//#######################################################################
// валидация body email password
const validateBodyEmailPassw = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .pattern(emailPattern)
      .message('Поле "email" должно быть валидным')
      .messages({
        "any.required": 'Не указан "email"',
        "string.empty": 'Поле "email" должно быть заполнено'
      }),
    password: Joi.string().required().messages({
      "any.required": 'Не указан "password"',
      "string.empty": 'Поле "password" должно быть заполнено'
    })
  })
});

// валидация body name, about
const validateBodyNameAbout = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line newline-per-chained-call
    name: Joi.string().required().min(2).max(30).messages({
      "any.required": 'Не указан "name"',
      "string.empty": 'Поле "name" должно быть заполнено'
    }),
    // eslint-disable-next-line newline-per-chained-call
    about: Joi.string().required().min(2).max(200).messages({
      "any.required": 'Не указан "about"',
      "string.empty": 'Поле "about" должно быть заполнено'
    })
    // .message("Поле 'about' не может быть пустым")
  })
});

// валидация body avatar
const validateBodyAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(urlPattern)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({
        "any.required": 'Не указан "avatar"',
        "string.empty": 'Поле "avatar" должно быть заполнено'
      })
  })
});

// валидация body name, link
const validateBodyNameLink = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line newline-per-chained-call
    name: Joi.string().required().min(2).max(30).messages({
      "any.required": 'Не указан "name"',
      "string.empty": "Поле 'name' не может быть пустым"
    }),
    link: Joi.string()
      .required()
      .pattern(urlPattern)
      .message('Поле "link" должно быть валидным url-адресом')
      .messages({
        "any.required": 'Не указан "link"',
        "string.empty": 'Поле "link" должно быть заполнено'
      })
  })
});

// валидация body
export const validateBody = (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl;
  console.log(url, "url!!!!!!!!!!!!");
  switch (url) {
    case "/signup":
      return validateBodyEmailPassw(req, res, next);
    case "/users/me":
      return validateBodyNameAbout(req, res, next);
    case "/users/me/avatar":
      return validateBodyAvatar(req, res, next);
    case "/cards":
      return validateBodyNameLink(req, res, next);
    default:
      return next(new NotFoundError("Запрашиваемый ресурс не найден"));
  }
};
