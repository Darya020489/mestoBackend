import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/unauthorizedError";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const auth = (req: Request, _res: Response, next: NextFunction) => {
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
    // console.log(req.headers, "req.headers");
    const token = req.headers.cookie?.replace("jwt=", "");
    // console.log(token, "token!!!");
    let payload: JwtPayload | null = null;
    payload = jwt.verify(token as string, JWT_SECRET as string) as JwtPayload;
    console.log(payload, "payload");

    req.user = payload;
    next();
  } catch (_error) {
    next(new UnauthorizedError("Необходима авторизация"));
  }
};

export default auth;
