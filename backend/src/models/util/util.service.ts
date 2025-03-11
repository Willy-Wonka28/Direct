import { LoggerService } from "../../logger/logger.service";
import { $Enums, Bank, ReceiverCurrency } from "@prisma/client";
import banks from "../../constants/banks.json";
import axios from "axios";
import { configService } from "../../utils/config/config.service";
import { BankErrorResponse, BankSuccessResponse } from "../../types/util.types";
import { InvalidAccountException } from "../../utils/exceptions/invalid-account.exception";
import { Token } from "@prisma/client";
import tokensData from "../../constants/tokens.json";
import { InternalServerErrorException } from "../../utils/exceptions/internal-server.exception";
import { ENV } from "../../constants/env.enum";
import PaystackBankMapping from "../../constants/paystackBankMapping";
export class UtilService {
  constructor(private readonly logger: LoggerService) {}

  getBanks() {
    const banks = Object.values($Enums.Bank);
    return banks;
  }
  getBankCode(bank: keyof typeof Bank) {
    const mappedName = PaystackBankMapping[bank];
    console.log(mappedName);
    const code = banks.find((b) => b.name === mappedName)?.code;

    if (!code) {
      throw new Error(`Bank "${bank}" not found`);
    }

    this.logger.info(`Bank code fetched successfully for ${bank}`);
    return code;
  }
  async verifyAccountNumber(bank: string, accountNumber: string) {
    const bankCode = this.getBankCode(bank as keyof typeof Bank);
    const url = `https://api.paystack.co/bank/resolve`;
    try {
      const result = await axios.get(url, {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
        headers: {
          Authorization: `Bearer ${configService.get(ENV.PAYSTACK_SECRET_KEY)}`,
          "Content-Type": "application/json",
        },
      });
      this.logger.info(
        `Bank verification response for ${accountNumber}:`,
        result.data
      );
      if (result.data.status) {
        return result.data.data as BankSuccessResponse;
      }
      let data = result.data as BankErrorResponse;
      throw new InvalidAccountException(
        "Invalid Account Details",
        data.message
      );
    } catch (error: any) {
      throw new InvalidAccountException(
        "Invalid Account Details",
        error.message
      );
    }
  }

  async listBanks() {
    try {
      const response = await axios.get("https://api.paystack.co/bank", {
        headers: {
          // Authorization: `Bearer ${configService.get(ENV.PAYSTACK_SECRET_KEY)}`,
          Accept: "application/json",
        },
      });
      this.logger.info("Banks fetched successfully", response.data);
      return response.data.data; // Array of banks with their codes
    } catch (error: any) {
      console.error(
        "Error fetching banks:",
        error.response?.data || error.message
      );
      throw new InternalServerErrorException("Failed to fetch banks");
    }
  }

  getTokens() {
    return Object.values(Token);
  }
  getCurrencies() {
    return Object.values(ReceiverCurrency);
  }
  async fetchExchangeRate(
    amount: number,
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
