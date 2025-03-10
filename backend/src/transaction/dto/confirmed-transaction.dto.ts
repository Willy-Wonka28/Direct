import { Token } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";

export class ConfirmedTransactionDto {
  @IsString()
  declare publicKey: string;

  @IsNumber()
  declare amountInToken: number;

  @IsEnum(Token)
  declare token: Token;

  @IsString()
  declare timestamp: string;

  @IsBoolean()
  declare status: boolean;
}
