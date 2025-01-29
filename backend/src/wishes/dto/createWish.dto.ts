import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from "class-validator";

export class CreateWishDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsString()
  @Length(1, 1500)
  description: string;
}
