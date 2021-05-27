import {AppThunk} from "../store";
import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {AccountBalance, AccountTransfer, BankAccount, TransferResult} from "../models/BankAccount";
import {getExchangeRate} from "./utils";

type LoadingAction = PayloadAction<boolean>;
type TransferSuccessAction = PayloadAction<TransferResult>;
type BalancesLoadSuccessAction = PayloadAction<AccountBalance[]>;
type ErrorAction = PayloadAction<string>;

const LOADING = 'app/balances/LOADING';
const TRANSFER_SUCCESS = 'app/balances/TRANSFER_SUCCESS';
const TRANSFER_ERROR = 'app/balances/TRANSFER_ERROR';

const BALANCE_LOAD_SUCCESS = 'app/balances/BALANCE_LOAD_SUCCESS';
const BALANCE_LOAD_ERROR = 'app/balances/BALANCE_LOAD_ERROR';

export interface BalancesState {
  balances: {
    [prop: string]: number
  };
  loading: boolean;
  error: string | null;
}

const initialState: BalancesState = {
  balances: {},
  loading: false,
  error: null,
};

const balancesReducer = createReducer(initialState, {
  [LOADING]: (state, action: LoadingAction) => {
    state.loading = action.payload;
  },
  [TRANSFER_SUCCESS]: (state, action: TransferSuccessAction) => {
    for (const {balance, currency} of action.payload.balancesEffected) {
      state.balances[currency] = balance;
    }
    state.error = null;
  },
  [BALANCE_LOAD_SUCCESS]: (state, action: BalancesLoadSuccessAction) => {
    const balances = action.payload;
    state.balances = {};
    for (const {balance, currency} of balances) {
      Object.assign(state.balances, {[currency]: balance});
    }

    state.error = null;
  },
  [BALANCE_LOAD_ERROR]: (state, action: ErrorAction) => {
    state.error = action.payload;
  },
  [TRANSFER_ERROR]: (state, action: ErrorAction) => {
    state.error = action.payload;
  }
});

function loadBalances(): AppThunk {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true} as LoadingAction);
    try {
      const balances = await BankAccount.getBalances();
      dispatch({
        type: BALANCE_LOAD_SUCCESS, payload: [...balances]
      } as BalancesLoadSuccessAction);
    } catch (e) {
      dispatch({type: BALANCE_LOAD_ERROR, payload: e.message} as ErrorAction);
    }
    dispatch({type: LOADING, payload: false} as LoadingAction);
  };
}

function makeTransfer(transfer: Omit<AccountTransfer, 'exchangeRate'>): AppThunk {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true} as LoadingAction);
    try {
      const rates = getState().rates.rates;
      if (!rates) {
        throw Error('Rates are not available');
      }
      const exchangeRate = getExchangeRate(rates, transfer.fromCurrency, transfer.toCurrency);
      const result = await BankAccount.makeTransfer({...transfer, exchangeRate});
      if (result.error) {
        throw Error(result.error);
      }
      dispatch({
        type: TRANSFER_SUCCESS, payload: result
      } as TransferSuccessAction);
    } catch (e) {
      dispatch({type: TRANSFER_ERROR, payload: e.message} as ErrorAction);
    }
    dispatch({type: LOADING, payload: false} as LoadingAction);
  };
}

export default balancesReducer;
export {loadBalances, makeTransfer};