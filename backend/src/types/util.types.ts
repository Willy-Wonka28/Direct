export type BankSuccessResponse = {
  account_number: string;
  account_name: string;
  first_name: string;
  last_name: string;
  other_name: string;
  bank_name: string;
  bank_code: string;
  requests: string;
  status: true;
};

export type BankErrorResponse = {
  status: false;
  message: any;
};
