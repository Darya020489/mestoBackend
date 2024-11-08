import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../errors/unauthorizedError";

export const urlPattern =
  "/^(https?|ftp)://(([a-zd]([a-zd-]*[a-zd])?.)+[a-z]{2,}|localhost)(/[-a-zd%_.~+]*)*(?[;&a-zd%_.~+=-]*)?(#[-a-zd_]*)?$/i";

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      default: "Жак-Ив Кусто"
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина поля 'about' - 2"],
      maxlength: [200, "Максимальная длина поля 'about' - 200"],
      default: "Исследователь"
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        // validator: (v: string) => validator.isURL(v, { require_protocol: true }),
        validator: (v: string) => validator.matches(v, urlPattern),
        message: "Поле 'avatar' должно быть валидным url-адресом"
      }
    },
    email: {
      type: String,
      required: [true, "Поле 'email' не может быть пустым"],
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Поле 'email' должно быть валидным email-адресом"
      }
    },
    password: {
      type: String,
      required: [true, "Поле 'password' не может быть пустым"],
      select: false // по умолчанию хеш пароля пользователя не будет возвращаться из базы
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

userSchema.static(
  "findUserByCredentials",
  async function findUserByCredentials(email: string, password: string) {
    // console.log(email, password);
    const currentUser = await this.findOne({ email })
      .select("+password")
      .orFail(() => new UnauthorizedError("Неправильные почта или пароль"));
    // console.log(password, currentUser.password, "currentUser.password");
    const passwordMatch = await bcrypt.compare(password, currentUser.password);
    // console.log(passwordMatch, "passwordMatch");
    if (!passwordMatch) {
      return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
    }
    return currentUser;
  }
);

export default mongoose.model<IUser, UserModel>("User", userSchema);
