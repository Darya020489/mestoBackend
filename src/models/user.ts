import mongoose from "mongoose";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Поле Имя не может быть пустым"],
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      unique: true
    },
    about: {
      type: String,
      required: [true, "Поле Информация не может быть пустым"],
      minlength: [2, "Минимальная длина поля 'about' - 2"],
      maxlength: [200, "Максимальная длина поля 'about' - 200"]
    },
    avatar: {
      type: String,
      required: [true, "Поле Аватар не может быть пустым"]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default mongoose.model<IUser>("User", userSchema);
