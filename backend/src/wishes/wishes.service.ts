import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Wish } from "./entities/wish.entity";
import { UsersService } from "src/users/users.service";
import { CreateWishDto } from "./dto/createWish.dto";
import { ServerException } from "src/exceptions/server.exception";
import { ErrorCode } from "src/exceptions/error-codes";
import { UpdateWishDto } from "./dto/updateWish.dto";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createWish(
    createWishDto: CreateWishDto,
    userId: number,
  ): Promise<Wish> {
    const owner = await this.usersService.findById(userId);
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
      raised: 0,
      copied: 0,
    });
    return this.wishesRepository.save(wish);
  }

  async findWishesByUserId(ownerId: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ["owner"],
    });
    return wishes;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const wishes = await this.wishesRepository.findBy({ owner: { username } });
    return wishes;
  }

  async findLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: 12356984 } },
      order: {
        createdAt: "DESC",
      },
      take: 40,
      relations: ["owner"],
    });
    return wishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        copied: "DESC",
      },
      take: 20,
      relations: ["owner"],
    });
    return wishes;
  }

  async findWishById(wishId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ["owner", "offers", "offers.user"],
    });
    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }
    return wish;
  }

  async getWishListByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository
      .createQueryBuilder("wish")
      .where("wish.id IN (:...ids)", { ids })
      .getMany();
    return wishes;
  }

  async getWishInfo(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (userId !== wish.owner.id) {
      const showOffers = wish.offers.filter((offer) => !offer.hidden);
      wish.offers = showOffers;
    }
    return wish;
  }

  async updateWishById(
    wishId: number,
    updateData: UpdateWishDto,
    userId: number,
  ): Promise<void> {
    const wish = await this.findWishById(wishId);
    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.UpdateWishForbidden);
    }
    if (updateData.price && wish.raised) {
      throw new ServerException(ErrorCode.UpdateRaisedForbidden);
    }
    const newWish = await this.wishesRepository.update(wishId, updateData);
    if (newWish.affected === 0) {
      throw new ServerException(ErrorCode.UpdateError);
    }
    console.log(newWish, "update wish");
  }

  async updateWishRaised(wishId: number, newRaisedSum: number): Promise<void> {
    const newWish = await this.wishesRepository.update(wishId, {
      raised: newRaisedSum,
    });
    if (newWish.affected === 0) {
      throw new ServerException(ErrorCode.UpdateError);
    }
    console.log(newWish, "updateWishRaised");
  }

  async removeWishById(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.DeleteWishForbidden);
    }
    await this.wishesRepository.delete({ id: wishId });
    return wish;
  }

  async copyWishById(wishId: number, userId: number): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const oldWish = await this.findWishById(wishId);
      if (userId === oldWish.owner.id) {
        throw new ServerException(ErrorCode.CopyForbidden);
      }
      const userWishesNames = (await this.findWishesByUserId(userId)).map(
        (wish) => wish.name,
      );
      // console.log(userWishesNames, "userWishesNames");
      if (userWishesNames.includes(oldWish.name)) {
        throw new ServerException(ErrorCode.AlreadyCopied);
      }
      const { name, link, image, description, price } = oldWish;
      const newWish = await this.createWish(
        { name, link, image, description, price },
        userId,
      );
      const updatedOldWish = await this.wishesRepository.update(wishId, {
        copied: oldWish.copied + 1,
      });
      if (updatedOldWish.affected === 0) {
        throw new ServerException(ErrorCode.UpdateError);
      }
      await queryRunner.commitTransaction();
      return newWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
