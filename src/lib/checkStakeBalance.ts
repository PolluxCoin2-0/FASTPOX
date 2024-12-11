import axios from "axios";

const FULL_NODE_TRANSACTION_URL =
  process.env.NEXT_PUBLIC_FULL_NODE_TRANSACTION_URL || "";

// Define the type for the API response
interface StakeBalanceResponse {
  address?: string;
  balance?: number;
  frozenV2?: Array<{ type?: string; amount?: number }>;
}

// Fetch Stake Balance
const getStakeBalance = async (
  walletAddress: string
): Promise<StakeBalanceResponse> => {
  try {
    const response = await axios.post(
      `${FULL_NODE_TRANSACTION_URL}/wallet/getaccount`,
      {
        address: walletAddress,
        visible: true,
      }
    );
    return response?.data || {}; // Ensure it always returns an object
  } catch (error) {
    console.error("Error fetching stake balance:", error);
    throw new Error("Failed to fetch stake balance.");
  }
};

// Check Vote Power and Stake Amount
export const checkStakeBalance = async (
  walletAddress: string
): Promise<boolean> => {
  try {
    const votePower = await getStakeBalance(walletAddress);

    // Validate `frozenV2` and calculate the total amount
    const totalAmount =
      votePower.frozenV2 && Array.isArray(votePower.frozenV2)
        ? votePower.frozenV2.reduce(
            (sum, item) => sum + (item?.amount || 0),
            0
          ) /
          10 ** 6
        : 0;
    if (totalAmount < 200) {
      return false; // Indicate insufficient stake
    }
    return true; // Indicate sufficient stake
  } catch (error) {
    console.error(error);
    return false; // Handle failure case
  }
};
