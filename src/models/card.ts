import { model, Schema } from "mongoose";
import validator from "validator";
import { urlPattern } from "../patterns/patterns";

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, "Поле 'name' не может быть пустым"],
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"]
    },
    link: {
      type: String,
      required: [true, "Поле 'link' не может быть пустым"],
      validate: {
        validator: (v: string) => validator.matches(v, urlPattern),
        // validator: (v: string) => validator.isURL(v, { require_protocol: true }),
        message: "Поле 'avatar' должно быть валидным url-адресом"
      }
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Поле 'owner' не может быть пустым"]
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model<ICard>("Card", cardSchema);
