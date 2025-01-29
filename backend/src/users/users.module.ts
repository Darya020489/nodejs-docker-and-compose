import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Wish } from "src/wishes/entities/wish.entity";
import { WishesModule } from "src/wishes/wishes.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish]),
    forwardRef(() => WishesModule),
    // forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
