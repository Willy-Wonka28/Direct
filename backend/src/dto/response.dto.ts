import { ResponseStatus } from "../constants/response-status.enum";

export class ResponseDto {
  constructor(
    public message: string,
    public status: ResponseStatus,
    public data?: any,
    public error?: any
  ) {}
}
