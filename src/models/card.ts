import { model, Schema } from "mongoose";

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
      required: [true, "Поле Имя не может быть пустым"],
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"]
    },
    link: {
      type: String,
      required: [true, "Поле Ссылка не может быть пустым"]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Поле Владелец не может быть пустым"]
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
