import {createSlice} from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    user: null,
    metaData: null,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.user = action.payload;
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLoggedInUser, setMetaData} = counterSlice.actions;
export default counterSlice.reducer;
