export type BankSuccessResponse = {
  account_number: string;
  account_name: string;
  bank_id: number;
};

export type BankErrorResponse = {
  status: false;
  message: any;
};
