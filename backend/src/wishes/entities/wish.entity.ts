import { IsNumber, IsUrl, Length } from "class-validator";
import { BaseEntity } from "src/entities/base.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Wish extends BaseEntity {
  @Column("varchar")
  @Length(1, 250)
  name: string;

  @Column("varchar")
  @IsUrl()
  link: string;

  @Column("varchar")
  @IsUrl()
  image: string;

  @Column("real")
  @IsNumber({ maxDecimalPlaces: 2 }) //округление до 2 сотых
  price: number;

  @Column("real")
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column("varchar")
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item) //ссылка на товар в Offer
  offers: Offer[];

  @Column({
    type: "integer",
    default: 0,
  })
  copied: number;
}
