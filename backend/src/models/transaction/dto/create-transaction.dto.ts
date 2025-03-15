import {
  Prisma,
  Token,
  TransactionStatus,
  Bank,
  ReceiverCurrency,
} from "@prisma/client";
import { IsDefined, IsNumber, IsString, IsEnum } from "class-validator";

export class CreateTransactionDto
  implements
    Omit<
      Prisma.TransactionCreateInput,
      | "amountNGN"
      | "updatedAt"
      | "createdAt"
      | "id"
      | "status"
      | "receiverAmount"
    >
{
  @IsDefined()
  @IsString()
  declare sender: string;

  @IsDefined()
  @IsString()
  declare publicKey: string;

  @IsDefined()
  @IsEnum(Token)
  declare senderToken: Token;

  @IsDefined()
  @IsNumber()
  declare senderAmount: number;

  @IsDefined()
  @IsEnum(ReceiverCurrency)
  declare receiverCurrency: ReceiverCurrency;
  @IsDefined()
  @IsString()
  declare receiverAccountNo: string;

  @IsDefined()
  @IsEnum(Bank)
  declare receiverBank: Bank;

  @IsDefined()
  @IsString()
  declare receiverName: string;
}
