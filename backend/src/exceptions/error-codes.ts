import { HttpStatus } from "@nestjs/common";

export enum ErrorCode {
  UpdateError = 400,
  ///////////////////////
  AlreadyCopied = 403.1,
  CopyForbidden = 403.2,
  UpdateWishForbidden = 403.3,
  UpdateForbidden = 403.4,
  UpdateRaisedForbidden = 403.5,
  DeleteWishForbidden = 403.6,
  DeleteForbidden = 403.7,
  OfferForbidden = 403.8,
  RaisedForbidden = 403.9,
  ///////////////////////
  UserNotFound = 404.1,
  WishNotFound = 404.2,
  WishlistNotFound = 404.3,
  UserAlreadyExists = 409,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.UpdateError, "Ошибка обновления, некорректные данные"],
  [ErrorCode.AlreadyCopied, "Вы уже копировали себе этот подарок"],
  [ErrorCode.CopyForbidden, "Нельзя копировать свои подарки"],
  [ErrorCode.UpdateWishForbidden, "Нельзя изменять чужие подарки"],
  [ErrorCode.UpdateForbidden, "Нельзя изменять чужие списки подарков"],
  [
    ErrorCode.UpdateRaisedForbidden,
    "Нельзя изменять стоимость подарка, если на него уже скинулись",
  ],
  [ErrorCode.DeleteWishForbidden, "Нельзя удалять чужие подарки"],
  [ErrorCode.DeleteForbidden, "Нельзя удалять чужие списки подарков"],
  [ErrorCode.OfferForbidden, "Нельзя вносить деньги на свои подарки"],
  [
    ErrorCode.RaisedForbidden,
    "Сумма поддержки не должна превышать стоимость подарка",
  ],
  [ErrorCode.UserNotFound, "Пользователь не найден"],
  [ErrorCode.WishNotFound, "Подарок не найден"],
  [ErrorCode.WishlistNotFound, "Список подарков не найден"],
  [
    ErrorCode.UserAlreadyExists,
    "Пользователь с таким email или username уже зарегистрирован",
  ],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.UpdateError, HttpStatus.BAD_REQUEST],
  [ErrorCode.AlreadyCopied, HttpStatus.FORBIDDEN],
  [ErrorCode.CopyForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.UpdateWishForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.UpdateForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.UpdateRaisedForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.DeleteWishForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.DeleteForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.OfferForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.RaisedForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.UserAlreadyExists, HttpStatus.CONFLICT],
]);
