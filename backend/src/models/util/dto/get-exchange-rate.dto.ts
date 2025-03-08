import { IsDecimal, IsEnum, IsNumberString } from "class-validator";
import { Token, ReceiverCurrency } from "@prisma/client";

export class GetExchangeRateDto {
  @IsNumberString()
  declare amount: string;

  @IsEnum(Token)
  declare fromToken: Token;

  @IsEnum(ReceiverCurrency)
  declare toCurrency: ReceiverCurrency;
}
