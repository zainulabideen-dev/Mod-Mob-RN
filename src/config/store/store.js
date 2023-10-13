import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appReducer";

export default configureStore({
  reducer: {
    appStoredData: appReducer,
  },
});
