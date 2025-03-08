import { LoggerService } from "../../logger/logger.service";
import { $Enums } from "@prisma/client";
import banks from "../../constants/banks.json";
import axios from "axios";
import { configService } from "../../utils/config/config.service";
import { BankErrorResponse, BankSuccessResponse } from "../../types/util.types";
import { InvalidAccountException } from "../../utils/exceptions/invalid-account.exception";
export class UtilService {
  constructor(private readonly logger: LoggerService) {}

  getBanks() {
    const banks = Object.values($Enums.Bank);
    this.logger.info("Banks fetched successfully");
    return banks;
  }
  getBankCode(bank: keyof typeof banks) {
    const code = banks[bank];

    if (!code) {
      throw new Error(`Bank "${bank}" not found`);
    }

    this.logger.info(`Bank code fetched successfully for ${bank}`);
    return code;
  }
  async verifyBank(bank: string, accountNumber: string) {
    const bankCode = this.getBankCode(bank as keyof typeof banks);
    const url = `https://nubapi.com/api/verify?account_number=${accountNumber}&bank_code=${bankCode}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${configService.get("NUBAPI_API_KEY")}`,
        "Content-Type": "application/json",
      },
    });
    if (result.data.status === true) {
      return result.data as BankSuccessResponse;
    }
    let data = result.data as BankErrorResponse;
    let cause = JSON.stringify(data.message);
    throw new InvalidAccountException("Invalid Account Details", cause);
  }
}
