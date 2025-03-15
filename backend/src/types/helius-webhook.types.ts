export interface HeliusWebhookData {
  accountData: {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: {
      mint: string;
      amount: number;
    }[];
  }[];
  description: string;
  events: Record<string, unknown>; // Empty object, can be extended
  fee: number;
  feePayer: string;
  instructions: {
    accounts: string[];
    data: string;
    innerInstructions: any[]; // Typically empty, but could be detailed
    programId: string;
  }[];
  nativeTransfers: {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: {
    mint: string; // Token identifier (e.g., USDT, USDC)
    tokenAmount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  transactionError: null | string;
  type: string; // Can be 'TRANSFER' or other transaction types
}
