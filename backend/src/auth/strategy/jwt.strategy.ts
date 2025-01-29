import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";

@Injectable()
// защищает контроллеры
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    console.log(configService.get<string>("jwt.secret"), "соль");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // считываем заголовки
      ignoreExpiration: false, //не проверять истечение срока действия токена
      secretOrKey: configService.get<string>("jwt.secret"), // передаем соль
    });
  }

  async validate(payload: { sub: number }) {
    // console.log(payload, "validate JwtStrategy");
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        "Неправильное имя пользователя или пароль",
      );
    }
    return user;
  }
}
