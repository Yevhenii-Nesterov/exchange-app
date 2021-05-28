import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {currencyCode} from "../../models/BankAccount";

import styles from './exchange.module.scss';
import cx from 'classnames';
import {CurrencySelector} from "./CurrencySelector";
import {AmountInput} from "./AmountInput";
import {getCurrencySign, getExchangeRate} from "../../modules/utils";
import {BalancesState} from "../../modules/balances";
import {RatesState} from "../../modules/rates";

interface CurrencySectionProps {
  balances: BalancesState;
  rates: RatesState;
  fromCurrency: currencyCode;
  toCurrency: currencyCode;
  type: 'from' | 'to';
  onCurrencyChange: (c: currencyCode) => void;
  onAmountChange: (c: string) => void;
  hasExchangeRate: boolean;
  amount: string;
}

export class CurrencySection extends PureComponent<CurrencySectionProps> {
  static propTypes = {
    balances: PropTypes.object.isRequired,
    rates: PropTypes.object.isRequired,
    fromCurrency: PropTypes.string.isRequired,
    toCurrency: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    hasExchangeRate: PropTypes.bool.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onCurrencyChange: PropTypes.func.isRequired,
  };

  BalanceField = (props: { account: string, 'data-testid'?: string }) => {
    const {account, 'data-testid': testId} = props;
    const {balances} = this.props;
    let content = '';
    if (balances.loading) {
      content = 'Loading balance...';
    } else {
      const amount = balances.balances?.[account];
      if (amount !== undefined) {
        content = `You have ${getCurrencySign(account)}${amount.toFixed(2)}`;
      }
    }
    return (<div className={styles.balanceField} data-testid={testId}>
      {content}
    </div>);
  };

  ExchangeRateField = () => {
    const {fromCurrency, toCurrency} = this.props;
    const fromSign = getCurrencySign(fromCurrency);
    const toSign = getCurrencySign(toCurrency);
    const {rates} = this.props;

    let content = rates.error ? rates.error : 'Loading rates...';

    if (rates.rates && !rates.error) {
      const rate = getExchangeRate(rates.rates!, this.props.fromCurrency, this.props.toCurrency);
      content = `${fromSign}1 = ${toSign}${rate.toFixed(5)}`;
    }

    return (
      <div className={styles.rateField} data-testid="exchange-rate">
        {content}
      </div>
    );
  };

  render() {
    const {ExchangeRateField, BalanceField} = this;
    const {
      balances,
      fromCurrency,
      toCurrency,
      hasExchangeRate,
      onCurrencyChange,
      onAmountChange,
      amount,
      type
    } = this.props;

    const selectedCurrency = type === 'from' ? fromCurrency : toCurrency;
    const unavailableCurrency = type === 'from' ? toCurrency : fromCurrency;
    const balanceAccount = type === 'from' ? fromCurrency : toCurrency;

    return (
      <section className={cx(styles.currencySection, {[styles.to]: type === 'to', [styles.from]: type === 'from'})}>
        <div className={styles.leftCol}>

          <CurrencySelector
            data-testid={`currency-${type}`}
            selected={selectedCurrency}
            codes={Object.keys(balances.balances) as currencyCode[]}
            unavailable={[unavailableCurrency]}
            onSelect={(code) => onCurrencyChange(code)}
          />

          <BalanceField data-testid={`balance-${type}`} account={balanceAccount}/>
        </div>

        <div className={styles.rightCol}>
          <AmountInput
            data-testid={`amount-${type}`}
            amount={amount}
            onAmountChange={(value) => onAmountChange(value)}
            sign={type === 'from' ? '-' : '+'}
          />
          {hasExchangeRate ? <ExchangeRateField data-testid="exchange-rate"/> : null}
        </div>

      </section>
    );
  }
}