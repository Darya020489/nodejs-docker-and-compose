import { HttpException, HttpStatus } from "@nestjs/common";
import { code2message, code2status, ErrorCode } from "./error-codes";

export class ServerException extends HttpException {
  public code: ErrorCode;

  constructor(code: ErrorCode) {
    // console.log(code);
    // console.log(code2message.get(code));
    // console.log(code2status.get(code));
    super(
      code2message.get(code) || "Ошибка сервера!",
      code2status.get(code) || HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.code = code;
  }
}
