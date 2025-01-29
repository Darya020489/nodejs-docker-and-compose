import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { AuthUser } from "src/common/decorators/user.decorator";
import { User } from "src/users/entities/user.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CreateWishDto } from "./dto/createWish.dto";
import { Wish } from "./entities/wish.entity";
import { UpdateWishDto } from "./dto/updateWish.dto";

@Controller("wishes")
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createWish(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.createWish(createWishDto, user.id);
  }

  @Get("last")
  async getLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishesService.findLastWishes();
    return wishes;
  }

  @Get("top")
  async getTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishesService.findTopWishes();
    return wishes;
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getWishById(
    @Param("id", ParseIntPipe) wishId: number,
    @AuthUser() user: User,
  ): Promise<Wish> {
    const wish = await this.wishesService.getWishInfo(wishId, user.id);
    return wish;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async updateWish(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ): Promise<void> {
    await this.wishesService.updateWishById(id, updateWishDto, user.id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteWishById(
    @Param("id", ParseIntPipe) wishId: number,
    @AuthUser() user: User,
  ): Promise<Wish> {
    const deletedWish = await this.wishesService.removeWishById(
      wishId,
      user.id,
    );
    return deletedWish;
  }

  @Post(":id/copy")
  @UseGuards(JwtAuthGuard)
  async copyWish(
    @Param("id", ParseIntPipe) wishId: number,
    @AuthUser() user: User,
  ) {
    const wish = await this.wishesService.copyWishById(wishId, user.id);
    return wish;
  }
}
