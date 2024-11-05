import { constants } from "http2";

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

export default NotFoundError;
