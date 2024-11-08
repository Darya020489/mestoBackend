import { Router, NextFunction, Request, Response } from "express";
import userRouter from "./users";
import cardRouter from "./cards";
import NotFoundError from "../errors/notFoundError";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardRouter);
// eslint-disable-next-line no-unused-vars
router.use("/", (_req: Request, _res: Response, _next: NextFunction) => {
  console.log("no route");
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

export default router;
