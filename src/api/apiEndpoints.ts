const API_ENDPOINTS = {
    auth: {
      login: "/signIn",
      register: "/signUp",
    },
    user: {
      getBalance: "/getBalanceOf",
      stakeBalance: "/stakePox",
      getUserDetails : "/getUser",
      claimReward : "/claimReward",
      getReferralRewards : "/getUserReferralRewards",
      mintUser :"/mintForUser",
      checkUserExistOrNot: "/checkUserExistOrNot",
      getClaimRewardAmount : "/getUserTotalRewards",
      unstake: "/unstake",
      getDirectBonus :"/getDirectBonus",
      getClaimedRewards : "/getClaimedRewards",
      getCappingRewards : "/getCappingRewards",
    },
    web2:{
      createStake:"/createStake",
      createMint :"/createMint",
      createClaim : "/createReward",
      updateStakeById:"/updateStakeById",
      updateUnStakeById : "/updateUnStakeById",
      getAllUserMintTrx:"/getAllUserMintTrx",
      getAllUserRewardTrx :"/getAllUserRewardTrx",
      getAllStakes:"/getAllStakes",
      getAllUserCount:"/getAllUserCount",
      getAllReferrals : "/getAllReferrals",
      calculateTotalStakedAmount : "/calculateTotalStakedAmount",
    },
    transaction:{
      approval:"/approval",
    }
  };
  
  export default API_ENDPOINTS;