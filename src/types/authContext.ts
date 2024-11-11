import { JwtPayload } from "jsonwebtoken";

export type AuthContext = {
  user: JwtPayload | null;
};
