import { MintTransactionDataInterface } from "@/interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { allMintTransactionWeb2Api } from "@/api/apiFunctions";
import ShimmerEffect from "../components/ShimmerEffect";

const MintedTransactions: React.FC = () => {
  const userStateData = useSelector((state: RootState)=>state?.wallet);
  const [isComponentLoading, setComponentLoading] = useState <boolean>(false);
  const [currentMintTrxPage, setCurrentMintTrxPage] = useState<number>(1);
  const [mintTrxDataArray, setMintTrxDataArray] = useState<MintTransactionDataInterface | null>(null);

  useEffect(()=>{
    if(userStateData?.isLogin){
     fetchData();
    }
  },[currentMintTrxPage])

  const fetchData = async()=>{
    setComponentLoading(true);
    // GET ALL MINT TRANSACTIONS DATA WEB2
    const allMintTrxWeb2ApiData = await allMintTransactionWeb2Api(userStateData?.dataObject?.token as string, currentMintTrxPage);
    console.log("mint transactions",allMintTrxWeb2ApiData);
    setMintTrxDataArray(allMintTrxWeb2ApiData?.data)
    setComponentLoading(false);
  }

  if (isComponentLoading) {
    return <ShimmerEffect />;
  }

  return (
    <div className="bg-[#161717] rounded-xl border border-gray-400 border-opacity-30 p-4 w-full overflow-x-auto">
      {/* Table Header */}
      <div className="bg-[#272727] rounded-xl text-white flex flex-row items-center justify-between py-2 min-w-[850px] md:min-w-0">
        <p className="font-bold px-8 py-2 w-[50%] text-left">Transaction</p>
        <p className="font-bold px-4 py-2 w-[25%] text-center">Mint Time</p>
        <p className="font-bold px-8 py-2 w-[25%] text-right">Amount</p>
      </div>

      {/* Transactions */}
      {mintTrxDataArray && mintTrxDataArray?.transactions?.length >0 ? mintTrxDataArray.transactions.map((transaction, index) => (
        <Link href={`https://poxscan.io/transactions-detail/${transaction?.trxId}`}
          key={index}
          className="text-white flex flex-row items-center justify-between pt-4 pb-2 border-b border-gray-400 border-opacity-30 last:border-0 min-w-[850px] md:min-w-0"
        >
          <p className="block xl:hidden px-8 py-2 w-[50%] text-left">{`${transaction?.trxId.slice(0,10)}...${transaction?.trxId.slice(-10)}`}</p>
          <p className="hidden xl:block px-8 py-2 w-[50%] text-left">{transaction?.trxId}</p>
          <p className="px-4 py-2 w-[25%] text-center">{new Date(transaction?.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
          <p className="px-8 py-2 w-[25%] text-right">{transaction?.amount/1000}</p>
        </Link>
      ))
    :
    <p className="text-white font-bold text-xl pl-4 pt-4">No Mint Transaction !</p>}

      <Pagination totalRecords={mintTrxDataArray?.transactionCount || 0} setPageNo={setCurrentMintTrxPage} currentMintTrxPage={currentMintTrxPage}/>
    </div>
  );
};

export default MintedTransactions;
