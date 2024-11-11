import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorizedError";
import "dotenv/config";
import { AuthContext } from "../types/authContext";

const { JWT_SECRET = "eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b" } =
  process.env;

const auth = (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  //   const authorization = req.cookies.jwt;
  //   if (!authorization || !authorization.startsWith("Bearer ")) {
  //     return res
  //       .status(ErrorStatusesEnum.UNAUTHORIZED)
  //       .send({ message: AUTHORIZATION_NEEDED });
  //   }
  //   const token: string = authorization.replace("Bearer ", "");
  //   let payload;
  //   try {
  //     payload = jwt.verify(token, process.env.JWT_SECRET);
  //   } catch {
  //     return res
  //       .status(ErrorStatusesEnum.UNAUTHORIZED)
  //       .send({ message: AUTHORIZATION_NEEDED });
  //   }
  //   req.user = payload;
  //   next();
  try {
    // const token = req.headers.cookie?.replace("jwt=", "");
    const token = req.cookies.jwt;
    // console.log(token, "token!!!");
    let payload: JwtPayload | null = null;
    payload = jwt.verify(token as string, JWT_SECRET as string) as JwtPayload;
    console.log(payload, "payload");
    res.locals.user = payload;
    next();
  } catch (_error) {
    next(new UnauthorizedError("Необходима авторизация"));
  }
};

export default auth;
