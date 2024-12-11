import React, { useState, useEffect } from "react";
import { getTotalTeamAmountApi } from "@/api/apiFunctions";

interface DynamicTeamAmountProps {
  walletAddress: string;
}

const DynamicTeamAmount: React.FC<DynamicTeamAmountProps> = ({ walletAddress }) => {
  const [teamAmount, setTeamAmount] = useState<number | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeamAmount = async () => {
      try {
        setLoading(true);
        const response = await getTotalTeamAmountApi(walletAddress);

        // Assuming response.data.amount is a number. Adjust as needed based on your API response.
        setTeamAmount(response?.data || 0);
      } catch (error) {
        console.error(`Error fetching team amount for ${walletAddress}:`, error);
        setTeamAmount("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAmount();
  }, [walletAddress]);

  return (
    <span>
      {loading ? "Loading..." : teamAmount}
    </span>
  );
};

export default DynamicTeamAmount;
