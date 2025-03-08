import { Prisma, Token, Status, Bank } from "@prisma/client";
import { IsDefined, IsNumber, IsString, IsEnum } from "class-validator";

export class CreateTransactionDto
  implements
    Omit<
      Prisma.TransactionCreateInput,
      "amountNGN" | "updatedAt" | "createdAt" | "id"
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
  declare token: Token;

  @IsDefined()
  @IsNumber()
  declare amount: number;

  @IsDefined()
  @IsString()
  declare receiverAccountNo: string;

  @IsDefined()
  @IsEnum(Bank)
  declare receiverBank: string;

  @IsDefined()
  @IsString()
  declare receiverName: string;

  @IsDefined()
  @IsEnum(Status)
  declare status: Status;
}
