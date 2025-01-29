import { IsUrl, Length } from "class-validator";
import { BaseEntity } from "src/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Wishlist extends BaseEntity {
  @Column("varchar")
  @Length(1, 250)
  name: string;

  @Column("varchar", {
    default: "Описание коллекции",
  })
  @Length(1, 1500)
  description: string;

  @Column("varchar")
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
