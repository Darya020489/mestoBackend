import mongoose, { Document, HydratedDocument } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../errors/unauthorizedError";

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface IUserMethods {
  // generateToken(): string;
  toJSON(): string;
}

interface IUserModel extends mongoose.Model<IUser, {}, IUserMethods> {
  findUserByCredentials: (
    email: string,
    password: string
    // ) => Promise<mongoose.Document<unknown, any, IUser>>;
  ) => Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
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
        validator: (v: string) => validator.isURL(v, { require_protocol: true }),
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
    timestamps: true,
    // удаление пароля в контроллере создания
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // eslint-disable-next-line no-param-reassign
        delete ret.password;
        return ret;
      }
    }
  }
);

// добавление хеша в контроллере регистрации
userSchema.pre("save", async function hashingPassword(next) {
  try {
    if (this.isModified("password")) {
      console.log("password hashing!!!!!!!!");
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// генерация токена
// userSchema.methods.generateToken = function generateToken() {
//   const token = jwt.sign(
//     { _id: this._id }, // Пейлоуд токена — зашифрованный в строку объект пользователя
//     NODE_ENV === "production" ? (JWT_SECRET as string) : "dev-secret-key",
//     { expiresIn: "7d" } // токен будет просрочен через 7 дней после создания
//   );
//   return token;
// };

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

export default mongoose.model<IUser, IUserModel>("User", userSchema);
