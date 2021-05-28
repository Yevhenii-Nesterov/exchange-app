import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render} from '@testing-library/react';
import {CurrencySection} from '../../../pages/exchange/CurrencySection';
import {BalancesState} from "../../../modules/balances";
import storeState from "../../storeState";
import {RatesState} from "../../../modules/rates";

describe('CurrencySection component tests', () => {

  const makeComponent = (type: 'from' | 'to', hasExchangeRate = false) => {
    const onCurrencyChange = jest.fn();
    const onAmountChange = jest.fn();
    const balances: BalancesState = storeState.balances;
    const rates: RatesState = storeState.rates;

    const utils = render(
      <CurrencySection
        amount={'20.2'}
        type={type}
        toCurrency={'USD'}
        fromCurrency={'GBP'}
        hasExchangeRate={hasExchangeRate}
        balances={balances}
        rates={rates}
        onCurrencyChange={onCurrencyChange}
        onAmountChange={onAmountChange}
      />
    );

    return {
      utils,
      onCurrencyChange,
      onAmountChange,
    };
  };

  it('Should render "from" type', async () => {
    const {utils} = makeComponent('from');
    const sign = utils.getByText('-');
    expect(sign).toBeInTheDocument();

    const balance = utils.getByTestId('balance-from');
    expect(balance).toBeInTheDocument();

    const currency = utils.getByTestId('currency-from');
    expect(currency).toBeInTheDocument();

    const selectedCurrency = currency.querySelector(`*[data-code="GBP"]`);
    expect(selectedCurrency).toBeInTheDocument();
    expect(selectedCurrency).toHaveClass('selected');
  });

  it('Should render "to" type', async () => {
    const {utils} = makeComponent('to', true);
    const sign = utils.getByText('+');
    expect(sign).toBeInTheDocument();

    const exchangeRate = utils.getByTestId('exchange-rate');
    expect(exchangeRate).toBeInTheDocument();

    const balance = utils.getByTestId('balance-to');
    expect(balance).toBeInTheDocument();

    const currency = utils.getByTestId('currency-to');
    expect(currency).toBeInTheDocument();

    const selectedCurrency = currency.querySelector(`*[data-code="USD"]`);
    expect(selectedCurrency).toBeInTheDocument();
    expect(selectedCurrency).toHaveClass('selected');
  });
});


