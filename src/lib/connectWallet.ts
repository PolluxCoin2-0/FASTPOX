import { toast } from "react-toastify";

// Define types for response data from `getPolinkweb`
interface WalletDetails {
  wallet_address: string;
  Balance: string;
  Price_USDT: string;
  Total_Energy: string;
  Avalible_Energy: string;
  Avalible_Vote: string;
  Avalible_Bandwidth: string;
  Claim_Rewards: string;
  Network: string;
  Total_Bandwidth: string;
  Total_Vote: string;
  USDX: string;
}

declare global {
  interface Window {
    pox?: {
      getDetails: () => Promise<object>;
      signdata: (data: object) => Promise<string []>;
      broadcast: (data: object) => Promise<string []>;
      multiSign: (data: object) => Promise<string []>;
    };
  }
}

export async function getPolinkweb(): Promise<WalletDetails> {
  const intervalDuration = 500; 

  return new Promise<WalletDetails>((resolve, reject) => {
    const obj = setInterval(async () => {
      try {
        if (window.pox) {
          clearInterval(obj);

          const detailsData = await window.pox.getDetails();
          const parsedDetailsObject = JSON.parse(JSON.stringify(detailsData));

          // Example network check (commented out if not needed)
          // if (parsedDetailsObject[1]?.data?.Network === "Yuvi Testnet") {
          //   toast.error("Switch to Mainnet Network");
          //   reject(new Error("Network is Yuvi Testnet"));
          //   return;
          // }

          const walletAddress = parsedDetailsObject[1]?.data as WalletDetails;
          console.log("walletAddress", walletAddress);

          if (walletAddress) {
            resolve(walletAddress); // Return wallet address if available
          } else {
            reject(new Error("Wallet address not found"));
          }
        }
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        toast.error("An error occurred while fetching wallet details.");
        clearInterval(obj); // Stop checking on error
        reject(error); // Reject promise if error occurs
      }
    }, intervalDuration);
  });
}