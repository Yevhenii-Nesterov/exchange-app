import {createAsyncThunk} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import {Transaction, TransactionsProvider} from "../models/TransactionsProvider";

const initialState: {
  transactions: Transaction[],
  error: string | null,
  loading: boolean,
} = {
  transactions: [],
  error: null,
  loading: false
};

const getTransactions = createAsyncThunk('transactions', async (update: boolean = false) => {
  return update ? TransactionsProvider.getUpdates() : TransactionsProvider.getTransactions();
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder => {
    builder.addCase(getTransactions.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactions = action.payload;
      //state.transactions = [...state.transactions, ...action.payload];

    });

    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Unknown error';
    });
  })
});

export default transactionsSlice.reducer;

export {getTransactions};