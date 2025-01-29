import { IsBoolean, IsNumber, Min } from "class-validator";
import { BaseEntity } from "src/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Offer extends BaseEntity {
  @Column("real")
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Column("boolean", { default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
