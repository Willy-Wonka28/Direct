import { Bank } from "prisma/prisma-client";
const BankMapping: Record<keyof typeof Bank, string> = {
  ACCESS_BANK: "Access Bank",
  GTBANK_PLC: "Guaranty Trust Bank",
  ZENITH_BANK_PLC: "Zenith Bank",
  UNITED_BANK_FOR_AFRICA: "United Bank For Africa",
  FIRST_BANK_OF_NIGERIA: "First Bank Of Nigeria",
  STERLING_BANK: "Sterling Bank",
  ECOBANK_BANK: "Ecobank Nigeria",
  POLARIS_BANK: "Polaris Bank",
  WEMA_BANK: "Wema Bank",
  UNITY_BANK: "Unity Bank",
  FIDELITY_BANK: "Fidelity Bank",
  PROVIDUS_BANK: "Providus Bank",
  KUDA_MICROFINANCE_BANK: "Kuda Microfinance Bank",
  PALMPAY: "PalmPay",
  OPAY: "OPay Digital Services Limited (OPay)",
};
export default BankMapping;
