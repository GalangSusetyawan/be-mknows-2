import {
  IsString, IsNotEmpty
} from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class UpdateCategoryDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;
}