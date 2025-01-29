import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CreateOfferDto } from "./dto/createOffer.dto";
import { AuthUser } from "src/common/decorators/user.decorator";
import { User } from "src/users/entities/user.entity";
import { Offer } from "./entities/offer.entity";

@UseGuards(JwtAuthGuard)
@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ): Promise<Offer> {
    const offer = await this.offersService.createOffer(createOfferDto, user.id);
    return offer;
  }

  @Get()
  async getOffers(): Promise<Offer[]> {
    const offers = await this.offersService.getAllOffers();
    return offers;
  }

  @Get(":id")
  async getOfferById(
    @Param("id", ParseIntPipe) offerId: number,
  ): Promise<Offer> {
    const offer = await this.offersService.getOfferById(offerId);
    return offer;
  }
}
