import axios from "axios";

const FULL_NODE_TRANSACTION_URL = process.env.NEXT_PUBLIC_FULL_NODE_TRANSACTION_URL || "";

interface TransactionReceipt {
  energy_fee: number;
  origin_energy_usage: number;
  energy_usage_total: number;
  net_fee: number;
  result: string;
}

interface ApiResponse {
  id: string;
  fee: number;
  blockNumber: number;
  blockTimeStamp: number;
  contractResult?: string[];
  contract_address?: string;
  receipt?: TransactionReceipt;
  result: string;
  resMessage?: string;
}

export const checkTransactionStatus = async (trxHash: string): Promise<string | null> => {
  const MAX_ATTEMPTS = 3;
  const DELAY = 3000;

  let attempt = 0;
  let verify: string | null = null;

  while (attempt < MAX_ATTEMPTS) {
    try {
      const response = await axios.post<ApiResponse>(FULL_NODE_TRANSACTION_URL + "/wallet/gettransactioninfobyid", {
        value: trxHash,
      });

      const data = response.data;
      console.log("Response data:", data);

      // Check if receipt exists in the response
      if (data.receipt) {
        verify = data.receipt.result; // Use the `result` field from `receipt`
        console.log("Transaction receipt found:", verify);
        break; // Exit the loop if receipt is found
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed with error:`, error);
    }

    attempt++;
    if (attempt < MAX_ATTEMPTS) {
      console.log(`Retrying... (${attempt}/${MAX_ATTEMPTS})`);
      await new Promise((resolve) => setTimeout(resolve, DELAY)); // Delay for 3 seconds
    }
  }

  if (!verify) {
    console.warn("Transaction receipt not found after maximum attempts.");
  }

  return verify;
};
