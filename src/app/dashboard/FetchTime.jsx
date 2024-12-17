import { useEffect, useState } from "react";
import { getLastMintTimeFromWeb3 } from "@/api/apiFunctions";
import Loader from "../components/Loader";

const FetchTime = ({ userStateData, index, buttonClick }) => {
  const [mintTime, setMintTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  // Function to fetch the time asynchronously
  const fetchMintTime = async () => {
    try {
      const result = await getLastMintTimeFromWeb3(
        userStateData?.dataObject?.walletAddress,
        index
      );
      console.log({ result });
      setMintTime(result || "No time available");
    } catch (error) {
      console.error("Error fetching mint time:", error);
      setMintTime("Error fetching time");
    }
  };

  const handleButtonClick = async (e) => {
    setIsLoading(true); // Show loader when the button is clicked
    await buttonClick(e, index, mintTime?.data?.amount);
    setIsLoading(false); // Hide loader after the button action completes
  };

  useEffect(() => {
    fetchMintTime();
  }, [userStateData, index]);

  return (
    <div
      className={`${
        mintTime?.data?.isUnstaked ? "text-gray-500" : "text-white"
      } flex flex-row items-center justify-between pt-4 min-w-[850px] 
       md:min-w-0 pb-2`}
    >
      <p className="px-8 py-2 w-[20%] text-left">{mintTime?.data?.amount}</p>
      <p className="px-4 py-2 w-[20%] text-center">
        {mintTime?.data?.mintCount} / 600
      </p>
      <p className="px-4 py-2 w-[20%] text-left lg:text-center">
        {mintTime?.data?.startTime}
      </p>
      <p className="px-0 lg:px-4 py-2 w-[20%] text-left lg:text-center">
        {mintTime?.data?.lastMintedAt}
      </p>
      <div className="lg:w-[20%] px-4 flex justify-end">
        {isLoading ? (
          <div className="w-full lg:w-[50%] rounded-xl flex justify-center bg-[linear-gradient(90deg,_#FFEE71_23%,_#FFF8A8_44.5%,_#F9DA6C_71%,_#FFF8A8_94.5%)]">
            <Loader />
          </div>
        ) : (
          <button
            disabled={mintTime?.data?.isUnstaked}
            onClick={handleButtonClick}
            className={`w-full lg:w-[50%] ${
              mintTime?.data?.isUnstaked
               ? "bg-[linear-gradient(90deg,_#FFEE71_23%,_#FFF8A8_44.5%,_#F9DA6C_71%,_#FFF8A8_94.5%)]"
        : "bg-[linear-gradient(90deg,_#FFEE71_23%,_#FFF8A8_44.5%,_#F9DA6C_71%,_#FFF8A8_94.5%)]"} 
      text-black text-lg font-bold px-4 py-2 rounded-xl transform hover:scale-105 transition delay-300`}
          >
            Mint
          </button>
        )}
      </div>
    </div>
  );
};

export default FetchTime;
