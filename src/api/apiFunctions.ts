import { 
  getRequest,
   postRequest, 
  putRequest
 } from "./apiGenericMethods";
import API_ENDPOINTS from "./apiEndpoints"; // Import the API endpoints
import axios from "axios";
import { allCountUser, allMintTransactionResponseInterface, BroadcastResponse, checkUserExistedInterface, getAllStakesResponseInterface, getbalanceInterface, LoginApiResponse, ReferralData, referralRewardInterface, registerInterface, stakeBalanceInterface, stakeUnstakebyIdInterface, Transaction,UpdateStakeResponseInterface,userDetailsInterface, userSRResponse, web2CreateMintInterface } from "@/interface";

const FULL_NODE_TRANSACTION_URL = process.env.NEXT_PUBLIC_FULL_NODE_TRANSACTION_URL || "";

// // APPROVAL
// export const approvalApi = async(walletAddress:string, amount:string):Promise<stakeBalanceInterface>=>{
//     return postRequest<stakeBalanceInterface>(API_ENDPOINTS.transaction.approval,{walletAddress, amount});
// }

// //   GET BALANCE OF USER
// export const getBalanceApi = async (walletAddress:string): Promise<getbalanceInterface> =>{
//     return postRequest<getbalanceInterface>(API_ENDPOINTS.user.getBalance,{walletAddress},"");
// }

// STAKE POX BALANCE
export const stakePoxBalanceApi = async(walletAddress:string, amount:string, referrer:string):Promise<stakeBalanceInterface>=>{
    return postRequest<stakeBalanceInterface>(API_ENDPOINTS.user.stakeBalance,{walletAddress, amount, referrer});
}

// REGISTER
export const registerApi = async(walletAddress:string, depositAmount:string, referredBy:string):Promise<registerInterface>=>{
    return postRequest<registerInterface>(API_ENDPOINTS.auth.register,{walletAddress, depositAmount, referredBy});
}

// LOGIN
export const loginApi = async (walletAddress: string): Promise<LoginApiResponse> => {
    return postRequest<LoginApiResponse>(API_ENDPOINTS.auth.login, { walletAddress }, "");
  };

// Broadcast API
export const broadcastApi = async (transaction: Transaction): Promise<BroadcastResponse> => {
  try {
    const broadcastResponse = await axios.post(
      `${FULL_NODE_TRANSACTION_URL}/wallet/broadcasttransaction`,
      transaction
    );

    return broadcastResponse?.data as BroadcastResponse;
  } catch (error) {
    console.error("Error broadcasting transaction:", error);
    throw new Error("Failed to broadcast transaction.");
  }
};

// GET USER DETAILS
export const getUserDetailsApi = async (walletAddress:string): Promise<userDetailsInterface> =>{
  return postRequest<userDetailsInterface>(API_ENDPOINTS.user.getUserDetails,{walletAddress},"");
}

// CLAIM REWARD
export const claimRewardApi = async (walletAddress:string): Promise<stakeBalanceInterface> =>{
  return postRequest<stakeBalanceInterface>(API_ENDPOINTS.user.claimReward,{walletAddress},"");
}

// GET USER REFERRAL REWARD
export const referralRewardApi = async (walletAddress:string): Promise<referralRewardInterface> =>{
  return postRequest<referralRewardInterface>(API_ENDPOINTS.user.getReferralRewards,{walletAddress},"");
}

// GET USER REFERRAL REWARD
export const claimRewardAmountApi = async (walletAddress:string): Promise<referralRewardInterface> =>{
  return postRequest<referralRewardInterface>(API_ENDPOINTS.user.getClaimRewardAmount,{walletAddress},"");
}

// MINT USER
export const mintUserApi = async (walletAddress:string, stakeIndex:number): Promise<stakeBalanceInterface> =>{
  return postRequest<stakeBalanceInterface>(API_ENDPOINTS.user.mintUser,{walletAddress, stakeIndex},"");
}

// CHECK USER EXISTED OR NOT
export const checkUserExistedApi = async (walletAddress:string, referredBy:string): Promise<checkUserExistedInterface> =>{
  return postRequest<checkUserExistedInterface>(API_ENDPOINTS.user.checkUserExistOrNot,{walletAddress, referredBy},"");
}

// WEB2 CREATE MINT API
export const createMintWeb2Api = async (walletAddress:string,trxId:string, amount:number, status:string, token:string): Promise<web2CreateMintInterface> =>{
  return postRequest<web2CreateMintInterface>(API_ENDPOINTS.web2.createMint,{walletAddress, trxId, amount, status},token);
}

// WEB2 CREATE CLAIM REWARD API
export const createClaimRewardWeb2Api = async (walletAddress:string,trxId:string, amount:number, status:string, token:string): Promise<web2CreateMintInterface> =>{
  return postRequest<web2CreateMintInterface>(API_ENDPOINTS.web2.createClaim,{walletAddress, trxId, amount, status},token);
}

// WEB2 UPDATE STAKE BY ID API 
export const updateStakeByIdWeb2Api = async (userId:string): Promise<UpdateStakeResponseInterface> =>{
  return putRequest<UpdateStakeResponseInterface>(  `${API_ENDPOINTS.web2.updateStakeById}/${userId}`);
}

// WEB2 MINT TRANSACTION API
export const allMintTransactionWeb2Api = async (token:string, pageNumber:number): Promise<allMintTransactionResponseInterface> =>{
  return getRequest<allMintTransactionResponseInterface>(API_ENDPOINTS.web2.getAllUserMintTrx, token,{page:pageNumber, limit:10});
}

// WEB2 CREATE STAKE TRANSACTION API
export const createStakeTransactionWeb2Api = async (walletAddress:string,trxId:string, amount:number, status:string, userId:string): Promise<web2CreateMintInterface> =>{
  return postRequest<web2CreateMintInterface>(`${API_ENDPOINTS.web2.createStake}/${userId}`,{walletAddress, trxId, amount, status},);
}

// WEB2 GET USER ALL STAKES
export const userAllStakesApi = async (token:string): Promise<getAllStakesResponseInterface> =>{
  return getRequest<getAllStakesResponseInterface>(API_ENDPOINTS.web2.getAllStakes,token);
}

// WEB2 GET USER ALL UNSTAKES
export const userAllUnStakesApi = async (token:string, pageNumber:number): Promise<getAllStakesResponseInterface> =>{
  return getRequest<getAllStakesResponseInterface>(API_ENDPOINTS.web2.getAllStakes,token, {page:pageNumber, limit:10});
}

// UNSTAKE API
export const unstakeApi = async (walletAddress:string, stakeIndex:number): Promise<stakeBalanceInterface> =>{
  return postRequest<stakeBalanceInterface>(API_ENDPOINTS.user.unstake,{walletAddress, stakeIndex});
}

// WEB2 GET USER ALL COUNT
export const getAllUserCountWeb2Api = async (): Promise<allCountUser> =>{
  return getRequest<allCountUser>(API_ENDPOINTS.web2.getAllUserCount);
}

// GET USER DIRECT BONUS
export const getDirectBonusApi = async (walletAddress:string): Promise<referralRewardInterface> =>{
  return postRequest<referralRewardInterface>(API_ENDPOINTS.user.getDirectBonus,{walletAddress});
}

// WEB2 GET ALL USERS CLAIM REWARDS TRANSACTIONS
export const claimRewardTransactionWeb2Api = async (token:string): Promise<getAllStakesResponseInterface> =>{
  return getRequest<getAllStakesResponseInterface>(API_ENDPOINTS.web2.getAllUserRewardTrx,token);
}

// GET USER TOTAL CLAIM REWARD AMOUNT
export const getTotalClaimRewwardApi = async (walletAddress:string): Promise<referralRewardInterface> =>{
  return postRequest<referralRewardInterface>(API_ENDPOINTS.user.getClaimedRewards,{walletAddress});
}

// GET STAKEUNSTAKE WEB2 API
export const stakeUnstakeByIdWeb2Api = async (id:string): Promise<stakeUnstakebyIdInterface> =>{
  return putRequest<stakeUnstakebyIdInterface>(`${API_ENDPOINTS.web2.updateUnStakeById}/${id}`);
}

// GET ALL REFERRALS TREE 

export const getAllReferralsTreeWeb2Api = async (token: string): Promise<ReferralData> => {
  return getRequest<ReferralData>(API_ENDPOINTS.web2.getAllReferrals,token);
}

// GET CAPPING AMOUNT
export const getCappingAmountApi = async (walletAddress: string): Promise<referralRewardInterface> => {
  return postRequest<referralRewardInterface>(API_ENDPOINTS.user.getCappingRewards,{walletAddress});
}

// GET TOTAL TEAM AMOUNT
export const getTotalTeamAmountApi = async (walletAddress: string): Promise<referralRewardInterface> => {
  return postRequest<referralRewardInterface>(API_ENDPOINTS.web2.calculateTotalStakedAmount,{walletAddress});
}

// GET USER IS SR OR NOT
export const getUserIsSR = async (walletAddress: string): Promise<userSRResponse> => {
  try {
    const userSRResponse = await axios.get(`https://node.poxscan.io/wallet/getUnderControl?userAddress=${walletAddress}`);
    return userSRResponse?.data as userSRResponse;
  } catch (error) {
    console.error("Error in user SR API:", error);
    throw new Error("Failed to get SR details.");
  }
};

// GET BALANCE FROM API MAINNET
export const mainnetBalanceApi = async (walletAddress:string) => {
  try {
    const apiResponse = await axios.post(
      `${FULL_NODE_TRANSACTION_URL}/wallet/getaccount`,
      {
        "address": walletAddress,
        "visible": true
    }
    );
    return apiResponse?.data
  } catch (error) {
    console.error("Error broadcasting transaction:", error);
    throw new Error("Failed to broadcast transaction.");
  }
};

