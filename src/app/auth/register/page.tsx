"use client";
import React, { useEffect, useState } from "react";
import {
  WalletIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LogoGray from "@/assests/PoxLogo.svg";
import Link from "next/link";
import { getPolinkweb } from "@/lib/connectWallet";
import { toast } from "react-toastify";
import {
  checkUserExistedApi,
  createStakeTransactionWeb2Api,
  mainnetBalanceApi,
  registerApi,
  stakePoxBalanceApi,
} from "@/api/apiFunctions";
// import { checkStakeBalance } from "@/lib/checkStakeBalance";
import Loader from "@/app/components/Loader";
import { useRouter, useSearchParams  } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SignBroadcastTransactionStatus } from "@/lib/signBroadcastTransactionStatus";
import Image from "next/image";

const RegistrationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  const [referralAddress, setReferralAddress] = useState<string>("");
  const [poxAmount, setPoxAmount] = useState<string>("");
  const router = useRouter();
  const userStateData = useSelector((state: RootState)=>state?.wallet);
  const searchParams = useSearchParams(); // Get the search parameters from the URL
  const referralAddressfromURL = searchParams.get("referralAddress");
  console.log("Referral Address:", referralAddressfromURL);

  useEffect(() => {
    if (referralAddressfromURL) {
      setReferralAddress(referralAddressfromURL as string); // Set referral wallet address
    }
  }, [referralAddress]);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleWalletAddress = async (): Promise<void> => {
    if (walletLoading) {
      toast.warning("Fetching wallet address...");
      return;
    }

    setWalletLoading(true);
    try {
      const walletAddress = await getPolinkweb();
      if (walletAddress?.wallet_address) {
        setUserWalletAddress(walletAddress?.wallet_address);
      }
    } catch (error) {
      toast.error("Something went wrong");
      throw error;
    } finally {
      setWalletLoading(false);
    }
  };

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (isLoading) {
      toast.warning("Registration in progress");
      return;
    }

    setIsLoading(true);

    try {
      if (!userWalletAddress || !referralAddress) {
        toast.error("All input fields must be completed.");
        setIsLoading(false);
        return;
      }

      if (!poxAmount || parseInt(poxAmount) <= 0) {
        toast.error("POX amount must be greater than 0.");
        setIsLoading(false);
        return;
      }

      if(parseInt(poxAmount)<10){
        toast.error("POX amount should be greater than or equal to 10.");
        setIsLoading(false);
        return;
      }

    // CHECK USER IS ALREADY REGISTERED OR NOT AND ENTERED REFERRAL ADDRESS IS VALID OR NOT
    const checkUserExistedApiData = await checkUserExistedApi(userWalletAddress, referralAddress);
    console.log("checkUserExistedApiData", checkUserExistedApiData);
    
    if(checkUserExistedApiData?.statusCode!==200){
      toast.error("Internal server error!");
      throw new Error("Internal server error!");
    }

     if(checkUserExistedApiData?.data === "Wallet address Already Exist"){
      toast.error("Wallet address already registered!");
      throw new Error("Wallet address already registered!");
     }

     if(checkUserExistedApiData?.data === "Invalid Referral Code") {
      toast.error("Invalid Referral Code!");
      throw new Error("Invalid Referral Code!");
     }

      //  CHECK USER HAVE 10 POX IS STAKED OR NOT
      // const isStakeSufficient = await checkStakeBalance(userWalletAddress);
      // if (isStakeSufficient) {
      //   toast.success("Stake amount is sufficient.");
      // } else {
      //   toast.error("Stake amount is insufficient");
      //   setIsLoading(false);
      //   throw new Error("Stake amount is insufficient.");
      // }

      // USER MUST HAVE A MINIMUM POX AMOUNT IN THEIR WALLET EQUAL TO OR GREATER THAN THE ENTERED AMOUNT
      const poxAmountOfUser = await mainnetBalanceApi(userWalletAddress);
      console.log("poxAmountOfUser", poxAmountOfUser?.balance);
      const userBalance = (poxAmountOfUser?.balance || 0) / Math.pow(10, 6);
      if (userBalance === 0) {
        toast.error(" Insufficient Pox.");
        throw new Error("Insufficient Pox.");
      }

      if (userBalance < parseInt(poxAmount)) {
        toast.error("Insufficient Pox.");
        throw new Error("Insufficient Pox.");
      }

        // STAKE POX AMOUNT
        const stakeBalanceApiData = await stakePoxBalanceApi(
          userWalletAddress,
          poxAmount,
          referralAddress
        );
        console.log("stakeBalanceApiData", stakeBalanceApiData);
        if (!stakeBalanceApiData?.data) {
          toast.error("Stake failed!");
          throw new Error("Stake failed!");
        }

        // SIGN TRANSACTION
        const stakedSignBroadcastTransactionStatusFuncRes = await SignBroadcastTransactionStatus(stakeBalanceApiData?.data?.transaction, userStateData?.isUserSR);
        if (
          !stakedSignBroadcastTransactionStatusFuncRes.transactionStatus || 
          stakedSignBroadcastTransactionStatusFuncRes.transactionStatus === "REVERT"
        ) {
          toast.error("Transaction failed!");
          throw new Error("Transaction failed!");
        }
        

      // Call the API to register the user with the wallet address and referral address
        const registerApiResponseData = await registerApi(
        userWalletAddress,
        poxAmount,
        referralAddress
      );
      console.log("registerApiRepsponseData", registerApiResponseData);
      if (registerApiResponseData?.data === "Duplicate Wallet") {
        toast.error("Wallet Address already registered!");
        throw new Error("Wallet Address already registered!");
      }

      if (registerApiResponseData?.data === "Invalid Referral Code") {
        toast.error("Invalid Referral Code!");
        throw new Error("Invalid Referral Code!");
      }

      if (registerApiResponseData?.statusCode !== 200) {
        toast.error("Registration failed!");
        throw new Error("Registration failed!");
      }

      if (typeof registerApiResponseData.data === "object") {
        // CREATE STAKE TRANSACTION WEB2 API
        const web2CreateStakeApiData = await createStakeTransactionWeb2Api(
        userWalletAddress,
        stakedSignBroadcastTransactionStatusFuncRes?.txid,
        parseInt(poxAmount),
        stakedSignBroadcastTransactionStatusFuncRes?.transactionStatus,
        registerApiResponseData?.data?.id);

        if(web2CreateStakeApiData?.statusCode!==200){
          throw new Error("Web2 create stake api failed!");
        }

        console.log({web2CreateStakeApiData})
      }

      toast.success("Registration Success");
      router.push("/");
    } catch (error) {
      console.log("error", error);
    } finally {
      setUserWalletAddress("");
      setPoxAmount("");
      setReferralAddress("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userStateData?.isLogin) {
      router.push("/dashboard");
    }
  }, [userStateData?.isLogin, router]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-4"
      style={{
        background:
        "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
      }}
    >
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/10 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex space-x-1 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.0}
                stroke="#1A2130"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>

              <h2 className="text-lg font-semibold text-gray-900">Info</h2>
            </div>
            <p className="mt-4 text-center text-gray-900">
              To earn{" "}
              <span className="font-semibold text-black">referral income</span>,
              you must stake a minimum of
              <span className="font-bold text-yellow-500"> 1,000 POX. </span>
            </p>
            <div className="mt-6 flex justify-center w-full">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2  bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600
                 text-white font-semibold rounded-md transition w-full"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moving Balls */}
      <div className="absolute inset-0 z-10">
  {Array.from({ length: 20 }).map((_, index) => (
    <div
      key={index}
      className="absolute rounded-full w-8 h-8 md:w-12 md:h-12 opacity-80 animate-smoothMove"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        backgroundColor: [
          "#FFEE71",
          "#FFF8A8",
          "#F9DA6C",
        ][Math.floor(Math.random() * 3)], // Randomly pick a color from the gradient points
        animation: `moveBall ${Math.random() * 10 + 5}s ease-in-out infinite`,
      }}
    ></div>
  ))}
</div>

      {/* Registration Card (Only visible if modal is closed) */}
      {
      !isModalOpen && 
      (
        <div className="bg-[#2e3030] backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl p-5 md:p-8 w-full max-w-md lg:max-w-lg xl:max-w-xl transform z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-4 md:mb-6 tracking-wide">
            FASTPOX REGISTRATION
          </h1>
          <form onSubmit={handleRegister} className="space-y-4 md:space-y-8">
            {/* Wallet Address Input */}
            <div className="relative group">
              <input
                value={userWalletAddress}
                onClick={userWalletAddress ? undefined : handleWalletAddress}
                type="text"
                placeholder="Wallet Address"
                className="w-full px-10 md:px-14 py-3 md:py-5 rounded-xl bg-white/10 text-white placeholder:text-white/70 focus:ring-1 focus:ring-white/40 focus:outline-none focus:shadow-lg transition duration-300"
              />
              <WalletIcon className="absolute top-1/2 left-3 md:left-4 h-6 w-6 md:h-8 md:w-8 text-white/60 group-focus-within:text-white transform -translate-y-1/2 transition duration-300" />
            </div>
            {/* Amount Input */}
            <div className="relative group">
              <input
                value={poxAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPoxAmount(e.target.value)
                }
                type="number"
                inputMode="numeric"
                placeholder="Pox Amount"
                className="w-full px-10 md:px-14 py-3 md:py-5 rounded-xl bg-white/10 text-white placeholder:text-white/70 focus:ring-1 focus:ring-white/40 focus:outline-none focus:shadow-lg transition duration-300 appearance-none"
              />
              <Image
              alt="gray-Pox-logo"
              src={LogoGray}
              width={0}
              height={0}
              className="absolute top-1/2 left-3 md:left-4 h-6 w-6 md:h-8 md:w-8 text-white/60 group-focus-within:text-white transform -translate-y-1/2 transition duration-300"
              />
            </div>
            {/* Referral Wallet Address Input */}
            <div className="relative group">
              <input
                value={referralAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReferralAddress(e.target.value)
                }
                type="text"
                placeholder="Referral Wallet Address"
                className="w-full px-10 md:px-14 py-3 md:py-5 rounded-xl bg-white/10 text-white placeholder:text-white/70 focus:ring-1 focus:ring-white/40 focus:outline-none focus:shadow-lg transition duration-300"
              />
              <UserIcon className="absolute top-1/2 left-3 md:left-4 h-6 w-6 md:h-8 md:w-8 text-white/60 group-focus-within:text-white transform -translate-y-1/2 transition duration-300" />
            </div>
            {/* Register Button */}
            {isLoading ? (
              <div className="w-full rounded-xl flex justify-center  bg-gradient-to-r from-yellow-300 to-yellow-500 ">
                <Loader />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 md:py-4 rounded-xl text-white font-semibold  bg-gradient-to-r from-yellow-300 to-yellow-500
                 hover:from-yellow-400 hover:to-yellow-600 shadow-xl hover:shadow-black/40 transform hover:scale-105 transition duration-300"
              >
                Register
              </button>
            )}
          </form>
          {/* Terms and Conditions */}
          <p className="text-xs md:text-sm text-white/70 mt-4 md:mt-6 text-center">
            By registering, you agree to our{" "}
            <a
              href="#"
              className="text-yellow-500 hover:text-yellow-300 underline"
            >
              Terms & Conditions
            </a>
            .
          </p>
          {/* Login Link */}
          <p className="text-xs md:text-sm text-white/70 mt-2 text-center">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-yellow-500 hover:text-yellow-300 underline"
            >
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
