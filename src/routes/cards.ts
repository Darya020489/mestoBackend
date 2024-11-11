import { Router } from "express";
import { createCard, deleteCard, dislikeCard, getCards, likeCard } from "../controllers/cards";
import { validateBody, validateObjId } from "../middleware/validation";

const cardRouter = Router();

cardRouter.get("/", getCards);
cardRouter.post("/", validateBody, createCard);
cardRouter.delete("/:cardId", validateObjId, deleteCard);
cardRouter.put("/:cardId/likes", validateObjId, likeCard);
cardRouter.delete("/:cardId/likes", validateObjId, dislikeCard);

export default cardRouter;
