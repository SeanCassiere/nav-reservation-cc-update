import { configureStore, combineReducers } from "@reduxjs/toolkit";

import configSlice from "./slices/config";
import formsSlice from "./slices/forms";

const batchedReducers = combineReducers({
	[configSlice.name]: configSlice.reducer,
	[formsSlice.name]: formsSlice.reducer,
});

const store = configureStore({
	reducer: batchedReducers,
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof batchedReducers>;

export const selectConfigState = (state: RootState) => state.config;
export const selectTranslations = (state: RootState) => state.config.translations;

export const selectCreditCardForm = (state: RootState) => state.forms.creditCardForm;

export default store;
