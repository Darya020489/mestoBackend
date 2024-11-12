import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorizedError";
import "dotenv/config";
import { AuthContext } from "../types/authContext";

const { JWT_SECRET = "eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b" } =
  process.env;

const auth = (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  // console.log(req.headers, "req.headers!!!");
  // console.log(req.cookies, "req.cookies!!!");
  const authorization = req.headers.authorization;
  console.log(authorization, "authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация!"));
  }
  const token: string = authorization.replace("Bearer ", "");
  let payload: JwtPayload | null;
  try {
    payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(payload, "payload");
    res.locals.user = payload;
    next();
    // try {
    // const token = req.headers.cookie?.replace("jwt=", "");
    // const token = req.cookies.token;
    // console.log(token, "token!!!");
    // let payload: JwtPayload | null = null;
    // payload = jwt.verify(token as string, JWT_SECRET as string) as JwtPayload;
    // console.log(payload, "payload");
    // res.locals.user = payload;
    // next();
  } catch (_error) {
    next(new UnauthorizedError("Необходима авторизация"));
  }
};

export default auth;
