import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wishlist } from "./entities/wishlist.entity";
import { CreateWishlistDto } from "./dto/createWishlist.dto";
import { WishesService } from "src/wishes/wishes.service";
import { UsersService } from "src/users/users.service";
import { UpdateWishlistDto } from "./dto/updateWishlist.dto";
import { ServerException } from "src/exceptions/server.exception";
import { ErrorCode } from "src/exceptions/error-codes";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsRepository.find({
      relations: ["owner", "items"],
    });
    return wishlists;
  }

  async createWishlist(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;
    const items = await this.wishesService.getWishListByIds(itemsId);
    const owner = await this.usersService.findById(userId);
    const newWishlist = await this.wishlistsRepository.save({
      ...rest,
      items,
      owner,
    });
    return newWishlist;
  }

  async findWishlistById(wishlistId: number): Promise<Wishlist> {
    const currentWishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: ["owner", "items"],
    });
    if (!currentWishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }
    return currentWishlist;
  }

  async updateWishlistById(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<void> {
    const currentWishlist = await this.findWishlistById(wishlistId);
    if (userId !== currentWishlist.owner.id) {
      throw new ServerException(ErrorCode.UpdateForbidden);
    }
    const newWishlist = await this.wishlistsRepository.update(
      wishlistId,
      updateWishlistDto,
    );
    if (newWishlist.affected === 0) {
      throw new ServerException(ErrorCode.UpdateError);
    }
    console.log(newWishlist, "update wishlist");
  }

  async removeWishlistById(
    wishlistId: number,
    userId: number,
  ): Promise<Wishlist> {
    const currentWishlist = await this.findWishlistById(wishlistId);
    if (userId !== currentWishlist.owner.id) {
      throw new ServerException(ErrorCode.DeleteForbidden);
    }
    await this.wishlistsRepository.delete({
      id: wishlistId,
    });
    return currentWishlist;
  }
}
