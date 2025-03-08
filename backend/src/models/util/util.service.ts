import { LoggerService } from "../../logger/logger.service";
import { $Enums, ReceiverCurrency } from "@prisma/client";
import banks from "../../constants/banks.json";
import axios from "axios";
import { configService } from "../../utils/config/config.service";
import { BankErrorResponse, BankSuccessResponse } from "../../types/util.types";
import { InvalidAccountException } from "../../utils/exceptions/invalid-account.exception";
import { Token } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import tokensData from "../../constants/tokens.json";
import { InternalServerErrorException } from "../../utils/exceptions/internal-server.exception";

export class UtilService {
  constructor(private readonly logger: LoggerService) {}

  getBanks() {
    const banks = Object.values($Enums.Bank);
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
    if (result.data.status === 200) {
      return result.data as BankSuccessResponse;
    }
    let data = result.data as BankErrorResponse;
    let cause = JSON.stringify(data.message);
    throw new InvalidAccountException("Invalid Account Details", cause);
  }
  getTokens() {
    return Object.values(Token);
  }
  getCurrencies() {
    return Object.values(ReceiverCurrency);
  }
  async fetchExchangeRate(
    amount: Decimal,
    fromToken: Token,
    toCurrency: ReceiverCurrency
  ) {
    const tokenData = tokensData.find((token) => token.symbol === fromToken);

    if (!tokenData) {
      this.logger.error(`Token not found in supported list: ${fromToken}`);
      throw new Error(`Unsupported token: ${fromToken}`);
    }

    // Convert currency to lowercase for CoinGecko API
    const currency = toCurrency.toLowerCase();

    this.logger.info(
      `Getting exchange rate for ${amount} ${fromToken} to ${toCurrency}`
    );

    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenData.id}&vs_currencies=${currency}`;
      const response = await axios.get(url);

      if (
        !response.data ||
        !response.data[tokenData.id] ||
        !response.data[tokenData.id][currency]
      ) {
        this.logger.error(
          `Failed to get rate data from CoinGecko for ${fromToken} to ${toCurrency}`
        );
        throw new Error(`Failed to get rate for ${fromToken} to ${toCurrency}`);
      }

      const rate = response.data[tokenData.id][currency];
      const convertedAmount = Number(amount) * rate;

      this.logger.info(
        `Rate: 1 ${fromToken} = ${rate} ${toCurrency.toUpperCase()}`
      );

      return {
        amount: Number(amount),
        convertedAmount,
        rate,
        fromToken,
        toCurrency,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Error getting exchange rate: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to get exchange rate: ${error.message}`
      );
    }
  }
}
