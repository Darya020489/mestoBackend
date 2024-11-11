import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import router from "./routes";
import errorHandler from "./middleware/error-handler";
import { createUser, login } from "./controllers/users";
import auth from "./middleware/auth";
import "dotenv/config";
import { requestLogger, errorLogger } from "./middleware/logger";
import { validateBody } from "./middleware/validation";

const { PORT = 3000, MONGO_URL = "mongodb://0.0.0.0:27017/mestodb" } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логер запросов

app.post("/signin", login);
app.post("/signup", validateBody, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger); // подключаем логер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // в конце обрабатываем все ошибки нашим централизованным обработчиком

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Соединение с базой установлено");

  app.listen(+PORT, () => {
    console.log(`App listening on port: ${PORT}`);
  });
};

connect();
