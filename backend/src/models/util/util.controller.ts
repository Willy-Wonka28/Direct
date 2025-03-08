import { ResponseStatusEnum } from "../../constants/response-status.enum";
import { ResponseDto } from "../../dto/response.dto";
import { UtilService } from "./util.service";
import { RequestHandler } from "express";
export class UtilsController {
  constructor(private readonly utilService: UtilService) {}

  getBank: RequestHandler = (req, res, next) => {
    try {
      const banks = this.utilService.getBanks();
      const resObj = new ResponseDto(
        "Banks fetched successfully",
        ResponseStatusEnum.SUCCESS,
        banks
      );
      res.json(resObj);
    } catch (e) {
      next(e);
    }
  };
  verifyBank: RequestHandler = async (req, res, next) => {
    try {
      const { bank, accountNumber } = req.body;
      const result = await this.utilService.verifyBank(bank, accountNumber);
      const resObj = new ResponseDto(
        "Account verified successfully",
        ResponseStatusEnum.SUCCESS,
        result
      );
      res.json(resObj);
    } catch (e) {
      next(e);
    }
  };
}
