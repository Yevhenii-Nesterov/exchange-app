import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import preloadedState from './initial-state'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory, History} from 'history'
import {routerMiddleware} from 'connected-react-router'
import logger from 'redux-logger'
import thunk from 'redux-thunk';

export const history = createBrowserHistory({
  basename: '/currency'
})


const createRootReducer = (history: History<unknown>) => combineReducers({
  router: connectRouter(history),
  counter: counterReducer,
})

const store = configureStore({
  reducer: createRootReducer(history),
  preloadedState,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history), thunk, logger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;