"use client";
import { claimRewardTransactionWeb2Api, getTotalClaimRewwardApi } from "@/api/apiFunctions";
import { TransactionInterface } from "@/interface";
import { RootState } from "@/redux/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShimmerEffect from "../components/ShimmerEffect";
import { useRouter } from "next/navigation";
import Pagination from "../components/Pagination";

const ClaimReward: React.FC= () => {
  const router = useRouter();
    const userStateData = useSelector((state: RootState)=>state?.wallet);
    const [isComponentLoading, setComponentLoading] = useState <boolean>(false);
    const [claimRewardDataArray, setClaimRewardDataArray] = useState<TransactionInterface[]>([]);
    const [claimRewardAmount, setClaimRewardAmount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async()=>{
        setComponentLoading(true);
        // GET ALL CLAIM REWARD TRANSACTION DATA
        const claimRewardData = await claimRewardTransactionWeb2Api(userStateData?.dataObject?.token as string);
    setTotalCount(claimRewardData?.data?.transactionCount);
        console.log({claimRewardData});
        setClaimRewardDataArray(claimRewardData.data.transactions);

        // GET TOTAL CLAIM REWARD AMOUNT
        const claimRewardAmountDataApi = await getTotalClaimRewwardApi(userStateData?.dataObject?.walletAddress as string);
        console.log({claimRewardAmountDataApi});
        setClaimRewardAmount(claimRewardAmountDataApi?.data);
        setComponentLoading(false);
    }

    useEffect(()=>{
        if(userStateData?.isLogin){
         fetchData();
        }
      },[])

      if(!userStateData?.isLogin){
        router.push("/");
       }
     
       if (isComponentLoading) {
         return <ShimmerEffect />;
       }

  return (
    <div className="min-h-screen bg-black px-2 md:px-4 py-7">
    <div className="bg-[#161717] rounded-xl border border-gray-400 border-opacity-30 p-4 w-full overflow-x-auto">

        <div className="flex flex-row justify-between items-center px-2 pb-6">
            <p className="text-white font-bold">Address : {userStateData?.dataObject?.walletAddress}</p>
            <p className="text-white font-bold">Total Clammed Sul : {claimRewardAmount}</p>
        </div>
      {/* Table Header */}
      <div className="bg-[#272727] rounded-xl text-white flex flex-row items-center justify-between py-2 min-w-[850px] md:min-w-0">
        <p className="font-bold px-8 py-2 w-[50%] text-left">Transaction</p>
        <p className="font-bold px-4 py-2 w-[25%] text-left">Clammed Date and Time</p>
        <p className="font-bold px-8 py-2 w-[25%] text-right">Clammed Sul</p>
      </div>

      {/* Transactions */}
      {claimRewardDataArray.length > 0 ?claimRewardDataArray.map((transaction, index) => (
        <Link href={`https://poxscan.io/transactions-detail/${transaction?.trxId}`}
          key={index}
          className="text-white flex flex-row items-center justify-between pt-4 pb-2 border-b border-gray-400 border-opacity-30 last:border-0 min-w-[850px] md:min-w-0"
        >
          <p className="block xl:hidden px-8 py-2 w-[50%] text-left">{`${transaction?.trxId.slice(0,10)}...${transaction?.trxId.slice(-10)}`}</p>
          <p className="hidden xl:block px-8 py-2 w-[50%] text-left">{transaction?.trxId}</p>
          <p className="px-4 py-2 w-[25%] text-left">{new Date(transaction?.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
          <p className="px-8 py-2 w-[25%] text-right">{transaction?.amount}</p>
        </Link>
      ))
    :  <p className="text-white font-bold text-xl pl-4 pt-4">Not Claimed Reward Found !
        </p>
    }
    </div>
    <Pagination totalRecords={totalCount || 0} setPageNo={setCurrentPage} currentMintTrxPage={currentPage}/>

    </div>
  );
};

export default ClaimReward;
