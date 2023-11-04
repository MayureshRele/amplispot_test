import { IsNotEmpty } from '@nestjs/class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  first_Name: string;
  @IsNotEmpty()
  last_Name: string;
}
