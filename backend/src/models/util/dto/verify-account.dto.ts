import { IsString, Length } from "class-validator";
export class VerifyAccountDto {
  @IsString()
  declare bank: string;

  @IsString()
  @Length(10)
  declare accountNumber: string;
}
