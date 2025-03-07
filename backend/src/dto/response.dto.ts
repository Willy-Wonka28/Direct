import { ResponseStatusEnum } from "../constants/response-status.enum";

export class ResponseDto {
  constructor(
    public message: string,
    public status: ResponseStatusEnum,
    public data?: any
  ) {}
}
