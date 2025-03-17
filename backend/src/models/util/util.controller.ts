import { ResponseStatus } from "../../constants/response-status.enum";
import { ResponseDto } from "../../dto/response.dto";
import { UtilService } from "./util.service";
import { RequestHandler } from "express";
export class UtilsController {
  constructor(private readonly utilService: UtilService) {}

  getBank: RequestHandler = (req, res, next) => {
    const banks = this.utilService.getBanks();
    const resObj = new ResponseDto(
      "Banks fetched successfully",
      ResponseStatus.SUCCESS,
      banks
    );
    res.json(resObj);
  };
  getTokens: RequestHandler = (req, res, next) => {
    const tokens = this.utilService.getTokens();
    const resObj = new ResponseDto(
      "Tokens fetched successfully",
      ResponseStatus.SUCCESS,
      tokens
    );
    res.json(resObj);
  };
  getCurrencies: RequestHandler = (req, res, next) => {
    const currencies = this.utilService.getCurrencies();
    const resObj = new ResponseDto(
      "Currencies fetched successfully",
      ResponseStatus.SUCCESS,
      currencies
    );
    res.json(resObj);
  };
  fetchExchangeRate: RequestHandler = async (req, res, next) => {
    try {
      const { amount, fromToken, toCurrency } = req.query as any;
      const result = await this.utilService.fetchExchangeRate(
        amount,
        fromToken,
        toCurrency
      );
      const resObj = new ResponseDto(
        "Rate fetched successfully",
        ResponseStatus.SUCCESS,
        result
      );
      res.json(resObj);
    } catch (e) {
      next(e);
    }
  };

  verifyBank: RequestHandler = async (req, res, next) => {
    try {
      const { bank, accountNumber } = req.query as any;
      const result = await this.utilService.verifyAccountNumber(
        bank,
        accountNumber
      );
      const resObj = new ResponseDto(
        "Account verified successfully",
        ResponseStatus.SUCCESS,
        result
      );
      res.json(resObj);
    } catch (e) {
      next(e);
    }
  };
}
