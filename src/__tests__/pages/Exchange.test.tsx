import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {rootReducer, RootState} from '../../store/';
import ExchangeConnected, {Exchange} from '../../pages/Exchange';
import {configureStore} from "@reduxjs/toolkit";
import mockedState from "../storeState";
import {CurrencyRatesProvider} from "../../models/CurrencyRatesProvider";

describe('Exchange page component tests', () => {
  const loadBalances = jest.fn();
  const makeTransfer = jest.fn();
  const loadRates = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    CurrencyRatesProvider.useMocked = true;
  });

  const createComponent = () => {
    const ExchangeComponent = <Exchange
      ratesUpdateIntervalSec={500}
      rates={mockedState.rates}
      balances={mockedState.balances}
      loadBalances={loadBalances}
      makeTransfer={makeTransfer}
      loadRates={loadRates}
    />;
    const utils = render(ExchangeComponent);

    const currencyFromEl = utils.getByTestId("currency-from");
    const currencyToEl = utils.getByTestId("currency-to");
    const balanceFromEl = utils.getByTestId("balance-from");
    const balanceToEl = utils.getByTestId("balance-to");
    const amountFromEl = utils.getByTestId("amount-from");
    const amountToEl = utils.getByTestId("amount-to");
    const btn = utils.getByTestId("exchange-btn");
    const exchangeRate = utils.getByTestId("exchange-rate");
    return {
      utils,
      loadBalances,
      makeTransfer,
      loadRates,
      currencyFromEl,
      currencyToEl,
      balanceFromEl,
      balanceToEl,
      amountFromEl,
      amountToEl,
      exchangeRate,
      btn,
      ExchangeComponent
    };
  };

  it('Should work with the store', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: mockedState as unknown as RootState,
    });

    const utils = render(
      <Provider store={store}>
        <ExchangeConnected ratesUpdateIntervalSec={500}/>
      </Provider>
    );

    const balanceFromEl = utils.getByTestId("balance-from");
    const balanceToEl = utils.getByTestId("balance-to");

    expect(balanceFromEl).toHaveTextContent('Loading balance...');
    expect(balanceToEl).toHaveTextContent('Loading balance...');
  });

  it('Should request data on mount', () => {
    const {
      loadBalances,
      loadRates,
    } = createComponent();

    expect(loadBalances).toHaveBeenCalledTimes(1);
    expect(loadRates).toHaveBeenCalledTimes(1);
  });

  it('Should refresh rates', () => {

    const {
      loadRates,
    } = createComponent();

    loadRates.mockReset();
    expect(loadRates).not.toHaveBeenCalled();
    jest.runTimersToTime(500 * 1000);
    expect(loadRates).toHaveBeenCalled();
  });

  it('Should render with currency selectors, input fields and action button', () => {
    const {
      currencyFromEl,
      currencyToEl,
      balanceFromEl,
      balanceToEl,
      amountFromEl,
      amountToEl,
      btn,
      utils,
    } = createComponent();

    const currencies = utils.getAllByText(/(USD|GBP|EUR)/);
    expect(currencies).toHaveLength(6);

    expect(amountFromEl).toBeInTheDocument();
    expect(amountToEl).toBeInTheDocument();
    expect(currencyFromEl).toBeInTheDocument();
    expect(currencyToEl).toBeInTheDocument();
    expect(balanceFromEl).toBeInTheDocument();
    expect(balanceToEl).toBeInTheDocument();

    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();

    const inputs = screen.getAllByTitle('Currency input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toBeEmpty();
    expect(inputs[1]).toBeEmpty();
  });

  it('Should render available balances for selected currencies', () => {

    const {
      balanceFromEl,
      balanceToEl,
    } = createComponent();

    expect(balanceFromEl).toHaveTextContent('You have £45656.12');
    expect(balanceToEl).toHaveTextContent('You have €7690.34');
  });


  it('Should render exchange rate for selected currencies', () => {

    const {
      exchangeRate
    } = createComponent();

    expect(exchangeRate).toHaveTextContent('£1 = €1.15615');
  });

  it('Should recalculate rate and show account for new selected to currency', () => {
    const {
      balanceFromEl,
      balanceToEl,
      exchangeRate,
      currencyToEl,
      ExchangeComponent,
      utils
    } = createComponent();

    const toUsd = currencyToEl.querySelector('div[data-code="USD"]');
    expect(toUsd).toBeInTheDocument();
    fireEvent.click(toUsd!);

    utils.rerender(ExchangeComponent);

    expect(balanceFromEl).toHaveTextContent('You have £45656.12');
    expect(balanceToEl).toHaveTextContent('You have $89.00');
    expect(exchangeRate).toHaveTextContent('£1 = $1.41249');
  });

  it('Should recalculate rate and show account for new selected from currency', () => {
    const {
      balanceFromEl,
      balanceToEl,
      exchangeRate,
      currencyFromEl,
      ExchangeComponent,
      utils
    } = createComponent();

    const fromUsd = currencyFromEl.querySelector('div[data-code="USD"]');
    expect(fromUsd).toBeInTheDocument();
    fireEvent.click(fromUsd!);

    utils.rerender(ExchangeComponent);

    expect(balanceFromEl).toHaveTextContent('You have $89.00');
    expect(balanceToEl).toHaveTextContent('You have €7690.34');
    expect(exchangeRate).toHaveTextContent('$1 = €0.81852');
  });

  it('Should recalculate amount in to input in case from input change', () => {
    const {
      amountFromEl,
      amountToEl,
      ExchangeComponent,
      utils
    } = createComponent();


    expect(amountFromEl).toHaveValue('');

    fireEvent.change(amountFromEl, {
      target: {
        value: '100'
      }
    });

    utils.rerender(ExchangeComponent);

    expect(amountFromEl).toHaveValue('100');
    expect(amountToEl).toHaveValue('115.61');
  });

  it('Should recalculate amount in from input in case to input change', () => {
    const {
      amountFromEl,
      amountToEl,
      ExchangeComponent,
      utils
    } = createComponent();


    expect(amountToEl).toHaveValue('');

    fireEvent.change(amountToEl, {
      target: {
        value: '100'
      }
    });

    utils.rerender(ExchangeComponent);

    expect(amountToEl).toHaveValue('100');
    expect(amountFromEl).toHaveValue('86.49');
  });

  it('Should perform exchange on btn click', () => {
    const {
      ExchangeComponent,
      utils,
      makeTransfer,
      btn,
    } = createComponent();


    expect(makeTransfer).not.toHaveBeenCalled();

    fireEvent.click(btn);

    utils.rerender(ExchangeComponent);

    expect(makeTransfer).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});


