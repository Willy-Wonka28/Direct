import axios from "axios";
import { configService } from "../config/config.service";
import { ENV } from "../../constants/env.enum";
const paymentApi = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${configService.get(ENV.PAYSTACK_SECRET_KEY)}`,
    "Content-Type": "application/json",
  },
});

export default paymentApi;
