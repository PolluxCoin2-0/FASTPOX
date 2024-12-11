import { walletStateInterface } from '@/interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state based on the WalletState type
const initialState: walletStateInterface = {
  dataObject: undefined,
  isLogin: false,
  isUserSR:false,
};

// Create the slice with proper types for reducers
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setDataObject: (state, action: PayloadAction<walletStateInterface['dataObject']>) => {
      state.dataObject = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setIsUserSR: (state, action: PayloadAction<boolean>) => {
      state.isUserSR = action.payload;
    },
  },
});

// Export the action and reducer
export const { setDataObject, setIsLogin, setIsUserSR} = walletSlice.actions;
export default walletSlice.reducer;
