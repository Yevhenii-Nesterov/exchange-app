import {AppThunk} from "../store";
import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {CurrenciesMap, CurrencyRates, CurrencyRatesProvider} from "../models/CurrencyRatesProvider";

type LoadingAction = PayloadAction<boolean>;
type SuccessAction = PayloadAction<{ rates: CurrencyRates, currencies: CurrenciesMap }>;
type ErrorAction = PayloadAction<string>;

const LOADING = 'app/rates/LOADING';
const RATES_LOAD_SUCCESS = 'app/rates/RATES_LOAD_SUCCESS';
const RATES_LOAD_ERROR = 'app/rates/RATES_LOAD_ERROR';

export interface RatesState {
  rates: CurrencyRates | null;
  currencies: CurrenciesMap | null;
  loading: boolean;
  error: string | null;
}

const initialState: RatesState = {
  rates: null,
  currencies: null,
  loading: false,
  error: null,
};

const ratesReducer = createReducer(initialState, {
  [LOADING]: (state, action: LoadingAction) => {
    state.loading = action.payload;
  },
  [RATES_LOAD_SUCCESS]: (state, action: SuccessAction) => {
    Object.assign(state, action.payload);
    state.error = null;
  },
  [RATES_LOAD_ERROR]: (state, action: ErrorAction) => {
    state.error = action.payload;
  }
})

function loadRates(): AppThunk {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true} as LoadingAction)
    try {
      const ratesPromise = CurrencyRatesProvider.getRates()
      const currenciesPromise = CurrencyRatesProvider.getCurrencies()
      const [rates, currencies] = await Promise.all([ratesPromise, currenciesPromise])
      dispatch({
        type: RATES_LOAD_SUCCESS, payload: {
          rates,
          currencies
        }
      } as SuccessAction)
    } catch (e) {
      dispatch({type: RATES_LOAD_ERROR, payload: e.message} as ErrorAction)
    }
    dispatch({type: LOADING, payload: false} as LoadingAction)
  }
}

export default ratesReducer
export {loadRates}