import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
// обрабатывает создание пользователя
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    console.log("validate LocalStrategy");
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(
        "Неправильное имя пользователя или пароль",
      );
    }
    return user;
  }
}
