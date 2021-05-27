import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import preloadedState from './initial-state';
import {combineReducers} from 'redux';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory, History} from 'history';
// import logger from 'redux-logger'
import thunk from 'redux-thunk';
import ratesReducer from '../modules/rates';
import balancesReducer from '../modules/balances';

export const history = createBrowserHistory();

const createRootReducer = (history: History<unknown>) => combineReducers({
  router: connectRouter(history),
  rates: ratesReducer,
  balances: balancesReducer
});

export const rootReducer = createRootReducer(history);

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history), thunk/*, logger*/)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;

export default store;