import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Offer } from "./entities/offer.entity";
import { CreateOfferDto } from "./dto/createOffer.dto";
import { UsersService } from "src/users/users.service";
import { WishesService } from "src/wishes/wishes.service";
import { ErrorCode } from "src/exceptions/error-codes";
import { ServerException } from "src/exceptions/server.exception";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number,
  ): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentWish = await this.wishesService.findWishById(
        createOfferDto.itemId,
      );
      if (userId === currentWish.owner.id) {
        throw new ServerException(ErrorCode.OfferForbidden);
      }
      const newRaisedSum = Number(
        (currentWish.raised + createOfferDto.amount).toFixed(2),
      );
      if (newRaisedSum > currentWish.price) {
        throw new ServerException(ErrorCode.RaisedForbidden);
      }
      const currentUser = await this.usersService.findById(userId);
      await this.wishesService.updateWishRaised(
        createOfferDto.itemId,
        newRaisedSum,
      );
      const offer = await this.offersRepository.save({
        ...createOfferDto,
        item: currentWish,
        user: currentUser,
      });
      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllOffers(): Promise<Offer[]> {
    const offers = await this.offersRepository.find({
      relations: ["item", "user"],
    });
    return offers;
  }

  async getOfferById(offerId: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id: offerId },
      relations: ["item", "user"],
    });
    return offer;
  }
}
