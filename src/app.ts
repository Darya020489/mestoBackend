import express from "express";
import mongoose from "mongoose";
import router from "./routes";
import errorHandler from "./middleware/error-handler";
import { createUser, login } from "./controllers/users";
import auth from "./middleware/auth";
import "dotenv/config";
import { requestLogger, errorLogger } from "./middleware/logger";
// import { AuthContext } from "./types/authContext";

const { PORT = 3000, MONGO_URL = "mongodb://0.0.0.0:27017/mestodb" } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const addUserId = (_req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
//   res.locals.user = {
//     _id: "672391369b8db7cd3768056d" // _id созданного пользователя
//   };
//   next();
// };
// app.use(addUserId);

app.use(requestLogger); // подключаем логер запросов

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use(router);

app.use(errorLogger); // подключаем логер ошибок

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
