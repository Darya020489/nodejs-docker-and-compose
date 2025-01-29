import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { WishesService } from "src/wishes/wishes.service";
import { AuthUser } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { EntityNotFoundFilter } from "src/common/filters/entity-not-found-exception.filter";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ServerException } from "src/exceptions/server.exception";
import { ErrorCode } from "src/exceptions/error-codes";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get("me")
  async findOne(@AuthUser() user: User): Promise<User> {
    const currentUser = await this.usersService.findOne({
      where: { id: user.id },
      // список возвращаемых полей
      select: {
        id: true,
        username: true,
        email: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!currentUser) {
      throw new ServerException(ErrorCode.UserNotFound);
    }
    return currentUser;
  }

  @Patch("me")
  @UseFilters(EntityNotFoundFilter)
  async updateUserData(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, "password">> {
    const { id } = user;
    const newUser = await this.usersService.updateUser(id, updateUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;
    return rest;
  }

  @Get("me/wishes")
  async getCurrentUserWishes(@AuthUser() user: User): Promise<Wish[]> {
    const wishes = await this.wishesService.findWishesByUserId(user.id);
    return wishes;
  }

  @Get(":username")
  async getUser(@Param("username") username: string): Promise<User> {
    const currentUser = await this.usersService.getUserByName(username);
    if (!currentUser) {
      throw new ServerException(ErrorCode.UserNotFound);
    }
    return currentUser;
  }

  @Get(":username/wishes")
  async getUserWishes(@Param("username") username: string): Promise<Wish[]> {
    const userWishes = await this.wishesService.findWishesByUsername(username);
    return userWishes;
  }

  @Post("find")
  async findUsers(@Body("query") query: string): Promise<User[]> {
    const users = await this.usersService.findMany(query);
    if (!users) {
      throw new ServerException(ErrorCode.UserNotFound);
    }
    return users;
  }
}
