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
import { WishlistsService } from "./wishlists.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Wishlist } from "./entities/wishlist.entity";
import { AuthUser } from "src/common/decorators/user.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateWishlistDto } from "./dto/createWishlist.dto";
import { UpdateWishlistDto } from "./dto/updateWishlist.dto";

@UseGuards(JwtAuthGuard)
@Controller("wishlistlists")
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getAllWishlists(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsService.findAll();
    return wishlists;
  }

  @Post()
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ): Promise<Wishlist> {
    const newWishlist = await this.wishlistsService.createWishlist(
      createWishlistDto,
      user.id,
    );
    return newWishlist;
  }

  @Get(":id")
  async getWishlistById(
    @Param("id", ParseIntPipe) wishlistId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findWishlistById(wishlistId);
    return wishlist;
  }

  @Patch(":id")
  async updateWishlist(
    @Param("id", ParseIntPipe) wishlistId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ): Promise<void> {
    await this.wishlistsService.updateWishlistById(
      wishlistId,
      updateWishlistDto,
      user.id,
    );
  }

  @Delete(":id")
  async deleteWishlistById(
    @Param("id", ParseIntPipe) wishlistId: number,
    @AuthUser() user: User,
  ): Promise<Wishlist> {
    const deletedWishlist = await this.wishlistsService.removeWishlistById(
      wishlistId,
      user.id,
    );
    return deletedWishlist;
  }
}
