"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import PoxGreenLogo from "@/assests/POXGREENLOGO.svg";
import StakeImg from "@/assests/Stake.svg";
import Mint from "@/assests/Mint.svg";
import MintedTransactions from "./MintedTransactions";
import ShimmerEffect from "@/app/components/ShimmerEffect";
import {claimRewardAmountApi, claimRewardApi, 
createClaimRewardWeb2Api, createMintWeb2Api, createStakeTransactionWeb2Api, getAllUserCountWeb2Api,  getBalanceApi,  getTotalStakeLengthFromWeb3,  getUserDetailsApi, mintUserApi, referralRewardApi, 
stakePoxBalanceApi, 
updateStakeByIdWeb2Api, userAllStakesApi } from "@/api/apiFunctions";
import { useSelector } from "react-redux";
import { TransactionInterface, UserDetailsData } from "@/interface";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignBroadcastTransactionStatus } from "@/lib/signBroadcastTransactionStatus";
import FetchTime from "./FetchTime";

const DashBoard: React.FC = () => {
  const router = useRouter();
  const userStateData = useSelector((state: RootState)=>state?.wallet);
  console.log({ userStateData });
  const [isComponentLoading, setComponentLoading] = useState <boolean>(false);
  const [isStakeLoading, setIsStakeLoading] = useState <boolean>(false);
  const [isClaimLoading, setIsClaimLoading] = useState <boolean>(false);
  const [isMintLoading, setIsMintLoading] = useState <boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetailsData | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [referralAmount, setReferralAmount] = useState<number>(0);
  const [stakedArray, setStakedArray] = useState<TransactionInterface[]>([]);
  const [claimRewardAmount, setClaimRewardAmount] = useState<number>(0);
  const [allUserCount ,  setAllUserCount] = useState<number>(0);
  const [contractAmount, setContractAmount] = useState<number>(0);
  const [totalStakeLengthFromWeb3, setTotalStakeLengthFromWeb3] = useState<number>(0);

  useEffect(()=>{
    if(userStateData?.isLogin){
     fetchData();
    }
  },[])

  const fetchData = async()=>{
    setComponentLoading(true);

    const walletAddress = userStateData?.dataObject?.walletAddress as string;
    const token = userStateData?.dataObject?.token as string;

    try {
      const [
        userDetailsApiData,
        referralRewardAPiData,
        stakesDataArray,
        claimRewardApiData,
        userCountDataApi,
        sulAmountData,
        totalStakeLengthFromWeb3Data
      ] = await Promise.all([
        getUserDetailsApi(walletAddress),
        referralRewardApi(walletAddress),
        userAllStakesApi(token),
        claimRewardAmountApi(walletAddress),
        getAllUserCountWeb2Api(),
        getBalanceApi(),
        getTotalStakeLengthFromWeb3(walletAddress)
      ]);

      setUserDetails(userDetailsApiData?.data);
      setReferralAmount(referralRewardAPiData?.data);

      const updatedStakes = stakesDataArray.data.transactions.map(
        (item: TransactionInterface) => ({
          ...item,
          isLoading: false,
        })
      );
      setStakedArray(updatedStakes);

      setClaimRewardAmount(claimRewardApiData?.data);
      setAllUserCount(userCountDataApi?.data);
      setContractAmount(sulAmountData?.data);
      setTotalStakeLengthFromWeb3(totalStakeLengthFromWeb3Data?.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally{
      setComponentLoading(false);
    }
  }

  console.log({stakedArray})

  if(!userStateData?.isLogin){
   router.push("/");
  }

  if (isComponentLoading) {
    return <ShimmerEffect />;
  }

//   function is24HoursCompleted(lastTime: string): boolean {
//     const currentTime: Date = new Date(); // Get the current date and time
//     const lastTimeDate: Date = new Date(lastTime); // Convert the given time to a Date object

//     // Calculate the difference in milliseconds
//     const timeDifference: number = currentTime.getTime() - lastTimeDate.getTime();

//     // Convert milliseconds to hours
//     const hoursDifference: number = timeDifference / (1000 * 60 * 60);

//     // Check if 24 hours have passed
//     return hoursDifference >= 24;
// }

  // STAKE FUNC
  const handleStakeFunc =async (e: React.MouseEvent<HTMLButtonElement> ): Promise<void> => {
    e.preventDefault();
    if(isStakeLoading){
      toast.warning("Staking in progress");
      return;
    }

    setIsStakeLoading(true);
    try {
      if (!stakeAmount || isNaN(parseInt(stakeAmount)) || parseInt(stakeAmount) <= 0) {
        toast.error("Invalid Stake Amount.");
        setIsStakeLoading(false);
        return;
      }

      if(parseInt(stakeAmount)<100){
        toast.error("Sul amount should be greater than or equal to 100.");
        setIsStakeLoading(false);
        return;
      }

       // USER MUST HAVE A MINIMUM SUL AMOUNT IN THEIR WALLET EQUAL TO OR GREATER THAN THE ENTERED AMOUNT
       const sulAmountOfUser = await getBalanceApi();
       console.log("sulAmountOfUser", sulAmountOfUser);
       if (sulAmountOfUser?.data === 0) {
         toast.error(" Insufficient Sul.");
         throw new Error("Insufficient Sul.");
       }
 
       if (sulAmountOfUser?.data < parseInt(stakeAmount)) {
         toast.error("Insufficient Sul.");
         throw new Error("Insufficient Sul.");
       }
       
      const stakedData = await stakePoxBalanceApi(userStateData?.dataObject?.walletAddress as string, stakeAmount, userStateData?.dataObject?.referredBy as string);
      console.log({stakedData});
      if (!stakedData?.data?.transaction) {
        toast.error("Staked Failed!");
        throw new Error("Saked Failed!");
      }

      const stakeSignBroadcastTransactionStatusFuncRes = await SignBroadcastTransactionStatus(stakedData?.data?.transaction, userStateData?.isUserSR);
      if (
        !stakeSignBroadcastTransactionStatusFuncRes.transactionStatus || 
        stakeSignBroadcastTransactionStatusFuncRes.transactionStatus === "REVERT"
      ) {
        toast.error("Transaction failed!");
        throw new Error("Transaction failed!");
      }
      

       // CREATE STAKE TRANSACTION WEB2 API
       const web2CreateStakeApiData = await createStakeTransactionWeb2Api(
        userStateData?.dataObject?.walletAddress as string,
        stakeSignBroadcastTransactionStatusFuncRes?.txid,
        parseInt(stakeAmount),
        stakeSignBroadcastTransactionStatusFuncRes?.transactionStatus,
        userStateData?.dataObject?._id as string);

        if(web2CreateStakeApiData?.statusCode!==200){
          throw new Error("Web2 create stake api failed!");
        }

        console.log({web2CreateStakeApiData})

      setStakeAmount("");
      await fetchData();
      toast.success("Staked successfully");
    } catch (error) {
      toast.error("Failed to stake amount!");
      console.error(error);
    } finally{
      setIsStakeLoading(false);
    }
  }

  // CLAIM REWARD FUNC
  const handleClaimRewardFunc = async (e: React.MouseEvent<HTMLButtonElement> ): Promise<void> => {
    e.preventDefault();
    if(isClaimLoading){
      toast.warning("Claiming reward in progress");
      return;
    }

    setIsClaimLoading(true);
    try {

      if(claimRewardAmount<=0){
        toast.error("Insufficient Amount!");
        throw new Error("Insufficient Amount!");
      }

      // CHECK USER HAVE MORE THAN ZERO AMOUNT TO CLAIM THEIR REWARD
      const claimRewardData = await claimRewardApi(userStateData?.dataObject?.walletAddress as string);
      console.log({claimRewardData});
      if (!claimRewardData?.data?.transaction) {
        toast.error("Claim Reward Failed!");
        throw new Error("Claim Reward Failed!");
      }

      // SIGN TRANSACTION
      const signBroadcastTransactionStatusFuncRes = await SignBroadcastTransactionStatus(claimRewardData?.data?.transaction, userStateData?.isUserSR);
      if (
        !signBroadcastTransactionStatusFuncRes.transactionStatus || 
        signBroadcastTransactionStatusFuncRes.transactionStatus === "REVERT"
      ) {
        toast.error("Transaction failed!");
        throw new Error("Transaction failed!");
      }
      

        // CREATE WEB2 CLAIM API
        const claimRewardWeb2ApiData = await createClaimRewardWeb2Api(
          userStateData?.dataObject?.walletAddress as string,
          signBroadcastTransactionStatusFuncRes?.txid, 
          claimRewardAmount, 
          signBroadcastTransactionStatusFuncRes?.transactionStatus,
          userStateData?.dataObject?.token as string
        )
        if(!claimRewardWeb2ApiData?.data){
          throw new Error("Create claim reward web2 api failed!");
        }
      console.log({ claimRewardWeb2ApiData });
      await fetchData();
      toast.success("Reward claimed successfully");
    } catch (error) {
      toast.error("Failed to claim reward!");
      console.error(error);
    } finally{
      setIsClaimLoading(false);
    }
  }

  // MINT FUNC
  const handleMintFunc = async (e: React.MouseEvent<HTMLButtonElement>, index:number, amount:number, userID:string,
    //  lastMintedTime:string 
    ): Promise<void> => {
    e.preventDefault();
    if(isMintLoading){
      toast.warning("Minting in progress");
      return;
    }

    setIsMintLoading(true);
    try {

      // 24 Hours completed or not
      // const isLastMintedTime = is24HoursCompleted(lastMintedTime);
      // if(!isLastMintedTime){
      //   toast.error("24 hours must pass before minting again.");
      //   throw new Error("24 hours must pass before minting again.");
      // }

       // Update the loading state for the specific item
    setStakedArray((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = { ...updatedState[index], isLoading: true };
      return updatedState;
    });

      // CHECK USER HAVE MORE THAN ZERO AMOUNT TO CLAIM THEIR REWARD
      const mintData = await mintUserApi(userStateData?.dataObject?.walletAddress as string, index);
      console.log({mintData});
      if (!mintData?.data?.transaction) {
        toast.error("Mint Failed!");
        throw new Error("Mint Failed!");
      }
      
      // SIGN TRANSACTION
      const signBroadcastTransactionStatusFuncRes = await SignBroadcastTransactionStatus(mintData?.data?.transaction, userStateData?.isUserSR);
      if (
        !signBroadcastTransactionStatusFuncRes.transactionStatus || 
        signBroadcastTransactionStatusFuncRes.transactionStatus === "REVERT"
      ) {
        toast.error("Transaction failed!");
        throw new Error("Transaction failed!");
      }      

       // WEB2 CREATE MINT API CALLING FUNCTIONS
       const web2MintApiData = await createMintWeb2Api(
        userStateData?.dataObject?.walletAddress as string,
        signBroadcastTransactionStatusFuncRes?.txid, 
        amount, 
        signBroadcastTransactionStatusFuncRes?.transactionStatus,
        userStateData?.dataObject?.token as string)
        console.log({web2MintApiData})

        if(web2MintApiData?.statusCode!==200){
          throw new Error("Save to DB Web2 Api Failed transaction");
        }

     // UPDATE WEB2 MINT DATA
     const web2updateStakeDataApi = await updateStakeByIdWeb2Api(userID);
     console.log({web2updateStakeDataApi});

     if(web2updateStakeDataApi?.statusCode!==200){
      throw new Error("Web2 Update Stake APi Failed transaction");
    }

      await fetchData();
      toast.success("Mint successfully");
    } catch (error) {
      toast.error("Failed to mint!");
      console.error(error);
    } finally{
       // Update the loading flag for the specific item
       setStakedArray((prevState) => {
        const updatedState = [...prevState];
        updatedState[index] = { ...updatedState[index], isLoading: false };
        return updatedState;
      });
    
      setIsMintLoading(false);
    }
  }

  const handleReferralLinkCopy = () => {
    if (userStateData?.dataObject?.walletAddress) {
      navigator.clipboard.writeText(`https://sulmine.sulaana.com/referral/${userStateData?.dataObject?.walletAddress}`)
        .then(() => {
          toast.success("Referral link copied to clipboard");
        })
        .catch((error) => {
          toast.error("Failed to copy referral link");
          console.error(error);
        });
    } else {
      toast.error("Wallet address is not available");
    }
  };

  return (
    <div className="min-h-screen bg-black px-2 md:px-4 py-7">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Link Section */}
      <div
        className="bg-[#333333]
         py-[18px] px-4 lg:px-8 rounded-xl flex justify-between items-center"
      >
        <p className="hidden xl:block text-white font-bold text-base truncate">
          Referral link: <span className="font-normal">{userStateData?.dataObject?.walletAddress as string}</span>
        </p>
        <p className="block xl:hidden text-white font-bold text-base truncate">
          Referral link: <span className="font-normal">
            {`${userStateData?.dataObject?.walletAddress && userStateData.dataObject.walletAddress.slice(0, 8)}...${userStateData?.dataObject?.walletAddress && userStateData.dataObject.walletAddress.slice(-8)}`}</span>
        </p>
        <svg
        onClick={handleReferralLinkCopy}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="size-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>

      {/* TOTAL USER */}
      <div
        className="bg-[#333333]
         py-[18px] px-4 lg:px-8 rounded-xl flex justify-between items-center"
      >
        <p className="text-white font-bold text-base truncate">
        Total Users / Total Staked :
        </p>
        <p className="text-white font-bold text-base">{allUserCount} / {contractAmount}</p>
      </div>
      </div>

      {/* Main Content Section */}
      <div className="py-8 rounded-lg">
  {/* First Subdiv */}
  <div className="space-y-5 flex flex-col">
    {/* Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Individual Stats */}
      {[{ value: userDetails?.depositAmount, text: "Stake Balance", icon: StakeImg,bgColor:"bg-[#0BF4C8]" },
        { value: userDetails?.totalROI, text: "Mint Balance", icon: Mint, bgColor:"bg-[#FAD85D]" },
        { value: referralAmount, text: "Referral Earnings", button: "View", bgColor:"bg-[#F3A9FF]" }]
        .map(({ value, text, icon, button, bgColor }, idx) => (
          <div
            key={idx}
            className={`px-6 py-3 rounded-xl flex flex-row justify-between items-center ${bgColor}`}
          >
            <div className="flex flex-col space-y-0 justify-start">
              <span className="text-2xl md:text-3xl font-bold text-black">
                {value}
              </span>
              <span className="text-xs md:text-base font-medium text-black">{text}</span>
            </div>
            {!button && (
              <Image
                src={icon}
                height={0}
                width={0}
                alt={text}
                className="w-[20%] md:w-[15%]"
              />
            )}
            {button && (
              <Link href="/ReferralEarningTrx" className="text-xs md:text-sm bg-black rounded-2xl py-[6px] px-3 md:px-4 font-bold text-white cursor-pointer">
                {button}
              </Link>
            )}
          </div>
        ))}
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stake Token Section */}
      <div className="border border-black bg-[#161717] rounded-xl px-6 md:px-8 py-8 md:py-10 flex flex-col justify-between">
        <p className="text-white font-bold text-2xl md:text-3xl">DEPOSIT TOKEN</p>
        <div className="grid grid-cols-[70%,26%] gap-4 my-8 pb-10 border-b border-gray-400 border-opacity-30">
          <div className="rounded-xl border border-gray-400 border-opacity-30 bg-[#1C1C1C] px-5 md:px-5 py-5">
          <input
          value={stakeAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStakeAmount(e.target.value)
          }
          className="w-full h-full rounded-xl bg-transparent outline-none placeholder:text-gray-300 text-white"
          type="number"
           placeholder="Enter Amount"
           />
          </div>
          <div className="flex flex-col items-center justify-center bg-[#1C1C1C] rounded-xl border border-gray-400 border-opacity-30">
            <Image src={PoxGreenLogo} alt="sul-image" height={0} width={0} className="w-[20%] md:w-[25%] pt-1" priority />
            <p className="text-white font-medium text-sm md:text-base pt-1">POX</p>
          </div>
        </div>
        {
          isStakeLoading?   <div className="w-full rounded-xl flex justify-center"
          style={{
            background: "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
          }}>
          <Loader />
        </div> : 
      <button
      onClick={handleStakeFunc}
      className="mt-1 w-full text-black text-lg md:text-2xl font-bold px-6 py-3 md:py-4 rounded-2xl transform hover:scale-105 transition-transform delay-200"
      style={{
        background: "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
      }}
    >
    DEPOSIT
    </button>    
        }
      </div>

      {/* Claim Token Section */}
      <div className="border border-black bg-[#1C1C1C] rounded-xl px-6 md:px-8 py-8 md:py-10 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <p className="text-white font-bold text-2xl md:text-3xl">CLAIM TOKEN</p>
          <div className="flex items-center space-x-1 cursor-pointer">
            <Link href="/ClaimReward" className="text-white text-xs md:text-sm font-thin">View Rewards</Link>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-[70%,26%] gap-4 my-8 pb-10 border-b border-gray-400 border-opacity-30">
          <div className="rounded-xl border border-gray-400 border-opacity-30 bg-sul-background px-5 md:px-7 py-3">
            <p className="text-white font-semibold text-xl md:text-2xl">{claimRewardAmount}</p>
            <p className="text-[#DFDFDF] text-sm opacity-70">Reward</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-sul-background rounded-xl border border-gray-400 border-opacity-30">
            <Image src={PoxGreenLogo} alt="sul-image" height={0} width={0} className="w-[20%] md:w-[25%] pt-1" priority />
            <p className="text-white font-medium text-sm md:text-base pt-1">POX</p>
          </div>
        </div>
        {
          isClaimLoading ?   <div className="w-full rounded-xl flex justify-center"
          style={{
            background: "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
          }}>
          <Loader />
        </div> :
        <button
        onClick={handleClaimRewardFunc}
        className="mt-1 w-full text-black text-lg md:text-2xl font-bold px-6 py-3 md:py-4 rounded-2xl transform hover:scale-105 transition-transform delay-200"
        style={{
          background: "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
        }}>
          CLAIM REWARD
        </button>
        }
      </div>
    </div>
  </div>

      </div>

      {/* Mint Table */}
      <div className="bg-[#161717] rounded-xl border-gray-400 border-[1px] border-opacity-30 p-4 my-4 w-full overflow-x-auto">
  {/* Header Section */}
  <div className="bg-[#272727] rounded-xl text-white flex flex-row items-center justify-between py-2 min-w-[850px] md:min-w-0">
    <p className="font-bold px-8 py-2 w-[20%] text-left">Amount</p>
    <p className="font-bold px-4 py-2 w-[20%] text-center">Maturity Days</p>
    <p className="font-bold px-4 py-2 w-[20%] text-center">Invest Date</p>
    <p className="font-bold px-4 py-2 w-[20%] text-center">Last Mint</p>
    <p className="font-bold px-8 py-2 w-[20%] text-right">Mint Reward</p>
  </div>

  {/* Data Rows */}
  {
    Array.from({ length: totalStakeLengthFromWeb3 }, (_, index) => {
      return (
     <>
          <FetchTime
            userStateData={userStateData}
            index={index}
            buttonClick={handleMintFunc}
          />
          </>
      );
    })
  }
</div>


      {/* Transaction Table */}
      <p className="font-bold text-white text-3xl mt-8 mb-4 pl-2 ">Transactions</p>
     <MintedTransactions  />
    </div>
  );
};

export default DashBoard;
