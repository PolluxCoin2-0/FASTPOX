"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletIcon } from "@heroicons/react/24/outline";
import Logo from "@/assests/FastPoxLogo.svg"; // Adjust logo path as needed
import Link from "next/link";
import { toast } from "react-toastify";
import { getPolinkweb } from "@/lib/connectWallet";
import { useRouter } from "next/navigation";
import { getUserIsSR, loginApi } from "@/api/apiFunctions";
import { useDispatch } from "react-redux";
import { setDataObject, setIsLogin, setIsUserSR } from "@/redux/slice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "@/app/components/Loader";

const Login: React.FC = () => {
  const router = useRouter();
  const userStateData = useSelector((state: RootState)=>state?.wallet);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userStateData?.isLogin) {
      router.push("/dashboard");
    }
  }, [userStateData?.isLogin, router]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement> ): Promise<void> => {
    e.preventDefault();
    if (isLoading) {
      toast.warning("Login in progress");
      return;
    }

    setIsLoading(true);

    try {
      const walletAddress = await getPolinkweb();
      if (!walletAddress || !walletAddress.wallet_address) {
        throw new Error("Wallet address not found.");
      }
    let userWalletAddress = walletAddress?.wallet_address;

      // CHECK USER IS SR OR NOT
      const userSRApiData = await getUserIsSR(userWalletAddress);
      console.log( userSRApiData)

      if(userSRApiData?.message==="adderss undercontrol found"){
        userWalletAddress = userSRApiData?.data;
        dispatch(setIsUserSR(true));
      }

      // CALL LOGIN API
      const loginApiData = await loginApi(userWalletAddress);
      console.log("loginApiData", loginApiData);
      if(loginApiData?.statusCode !==200){
        toast.error("Invalid wallet address or login failed.");
        throw new Error("Invalid wallet address or login failed.");
      }
      dispatch(setIsLogin(true));
       // Update loginApi data object with walletAddress if userSRApiData condition is true
  const updatedLoginData = {
    ...loginApiData?.data,
    walletAddress: userWalletAddress,
  };
      dispatch(setDataObject(updatedLoginData));
      toast.success("Login successful");
      // Redirect to home page or any other desired page
      router.push("/dashboard");
    } catch (error) {
      toast.error("Invalid wallet address or login failed.");
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, #FFEE71 23%, #FFF8A8 44.5%, #F9DA6C 71%, #FFF8A8 94.5%)",
        }}
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-md bg-[#2e3030] backdrop-blur-lg rounded-xl p-6 md:p-10 shadow-2xl mx-4 sm:mx-6">
        {/* Logo and Brand Name */}
        <div className="text-center mb-6 md:mb-8">
          <Image
            src={Logo} // Replace with your logo path
            alt="Sulmine Logo"
            width={200} // Adjust logo width
            height={50} // Adjust logo height
            className="mx-auto"
          />
        </div>

        {/* Buttons */}
        <div className="">
          {/* Register Button */}
          <Link href="/auth/register">
            <button className="w-full py-3 md:py-4 mb-4 rounded-xl text-black font-semibold 
            bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 shadow-lg 
            transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2">
              Register
            </button>
          </Link>

          {/* Connect Wallet Button */}
          {isLoading ? (
            <div className="w-full rounded-xl flex justify-center  bg-gradient-to-r from-yellow-300 to-yellow-500 ">
              <Loader />
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full py-3 md:py-4 rounded-xl text-white font-semibold bg-white/20 backdrop-blur-lg border border-white/40 hover:bg-white/30 transition duration-300 flex items-center justify-center shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <WalletIcon className="h-6 w-6 mr-2 text-white" />
              Connect Wallet
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/80 text-xs md:text-sm">
          <p>By logging in, you agree to our</p>
          <Link href="#" className="text-white/90 hover:text-white underline">
            Terms & Conditions
          </Link>
        </div>
      </div>

      {/* Animation Container */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tl from-yellow-600 to-white opacity-20 animate-pulse"></div>
    </div>
  );
};

export default Login;
