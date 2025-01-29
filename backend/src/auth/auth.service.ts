import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { verifyHash } from "src/helpers/hash";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<{ access_token: string }> {
    const { username, id: sub } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOne({
        select: { username: true, password: true, id: true },
        where: { username },
      });
      if (!user) return null;
      const verifyPassword = await verifyHash(password, user.password);
      if (verifyPassword) {
        // const { password, ...result } = user;
        return user;
      }
      return null;
    } catch (err) {
      console.log(err, "validateUser error!");
      throw new UnauthorizedException(
        "Неправильное имя пользователя или пароль",
      );
    }
  }
}
