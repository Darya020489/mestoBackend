import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import router from "./routes";
import errorHandler from "./middleware/error-handler";
// import { AuthContext } from "./types/authContext";

const { PORT = 3000, MONGO_URL = "mongodb://0.0.0.0:27017/mestodb" } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

// const addUserId = (_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
//   res.locals.user = {
//     _id: "672391369b8db7cd3768056d" // _id созданного пользователя
//   };
//   next();
// };
const addUserId = (req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: "672391369b8db7cd3768056d"
  };
  next();
};

app.use(addUserId);

app.use(router);

// в конце обрабатываем все ошибки нашим централизованным обработчиком
app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Соединение с базой установлено");

  app.listen(+PORT, () => {
    console.log(`App listening on port: ${PORT}`);
  });
};

connect();
