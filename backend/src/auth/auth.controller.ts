import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { AuthUser } from "src/common/decorators/user.decorator";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async login(@AuthUser() user: User): Promise<{ access_token: string }> {
    console.log(user, "userLogin");
    return this.authService.login(user);
  }
}
