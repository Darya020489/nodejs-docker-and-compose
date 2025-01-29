import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { Wish } from "./entities/wish.entity";
import { WishesController } from "./wishes.controller";
import { WishesService } from "./wishes.service";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
