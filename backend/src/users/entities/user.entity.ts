import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsUrl, Length } from "class-validator";
import { BaseEntity } from "src/entities/base.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column("varchar", {
    unique: true,
  })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column("varchar", {
    default: "Пока ничего не рассказал о себе",
  })
  @Length(2, 200)
  about: string;

  @Column("varchar", {
    default: "https://i.pravatar.cc/300",
  })
  @IsUrl()
  avatar: string;

  @Exclude()
  @Column("varchar", {
    unique: true,
    select: false,
  })
  @IsEmail()
  email: string;

  @Exclude()
  @Column("varchar", { select: false })
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner) // , { eager: true }) Автоматическая загрузка связанных записей
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
