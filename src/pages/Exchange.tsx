import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import connector, {PropsFromState} from './exchange/exchange-store-connector';
import {currencyCode} from "../models/BankAccount";

import styles from './exchange/exchange.module.scss';
import {CurrencySection} from "./exchange/CurrencySection";
import {getExchangeRate} from "../modules/utils";

interface ExchangeProps extends PropsFromState {
  ratesUpdateIntervalSec: number
}

interface ExchangeState {
  timer: null | number;
  fromCurrency: currencyCode;
  toCurrency: currencyCode;
  fromAmount: string;
  toAmount: string;
  lastValueSource: 'fromAmount' | 'toAmount'
}

export class Exchange extends PureComponent<ExchangeProps, ExchangeState> {
  static propTypes = {
    ratesUpdateIntervalSec: PropTypes.number.isRequired
  };

  constructor(props: ExchangeProps) {
    super(props);

    this.state = {
      timer: null,
      fromAmount: '',
      toAmount: '',
      fromCurrency: 'GBP',
      toCurrency: 'EUR',
      lastValueSource: "fromAmount"
    };
  }

  componentDidMount() {
    this.props.loadRates();
    this.props.loadBalances();
    const timer = window.setInterval(() => this.props.loadRates(), this.props.ratesUpdateIntervalSec * 1000);
    this.setState({timer});
  }

  componentWillUnmount() {
    if (this.state.timer !== null) {
      clearInterval(this.state.timer);
    }
  }

  onAmountChange = (value: string, type: 'fromAmount' | 'toAmount') => {
    const rate = this.props.rates ? getExchangeRate(this.props.rates.rates!, this.state.fromCurrency, this.state.toCurrency) : 0;

    if (type === 'fromAmount') {
      const toAmount = value !== '' ? (Number(value) * rate).toFixed(2) : '';
      this.setState({fromAmount: value, toAmount});
    } else {
      const fromAmount = value !== '' ? (Number(value) / rate).toFixed(2) : '';
      this.setState({toAmount: value, fromAmount});
    }
  };

  onCurrencyChange = (currency: currencyCode, type: 'fromCurrency' | 'toCurrency') => {
    // trigger field value recalculation for opposite side
    const {lastValueSource} = this.state;
    this.setState({[type]: currency} as unknown as ExchangeState, () => {
      this.onAmountChange(this.state[lastValueSource], lastValueSource);
    });
  };

  ToSection = () => {
    const {balances, rates} = this.props;
    const {fromCurrency, toCurrency, toAmount} = this.state;
    return (
      <CurrencySection
        amount={toAmount}
        onAmountChange={(value) => this.onAmountChange(value, 'toAmount')}
        rates={rates}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        balances={balances}
        onCurrencyChange={(value) => this.onCurrencyChange(value, 'toCurrency')}
        hasExchangeRate={true}
        type={"to"}
      />
    );
  };

  FromSection = () => {
    const {balances, rates} = this.props;
    const {fromCurrency, toCurrency, fromAmount} = this.state;
    return (
      <CurrencySection
        amount={fromAmount}
        onAmountChange={(value) => this.onAmountChange(value, 'fromAmount')}
        rates={rates}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        balances={balances}
        onCurrencyChange={(value) => this.onCurrencyChange(value, 'fromCurrency')}
        hasExchangeRate={false}
        type={"from"}
      />
    );
  };

  exchangeClick = () => {
    const {balances} = this.props;
    if (balances.loading) {
      return;
    }

    const {fromCurrency, toCurrency, fromAmount} = this.state;
    this.props.makeTransfer({
      fromCurrency,
      toCurrency,
      amountInFromCurrency: Number(fromAmount)
    });
  };

  render() {
    const {FromSection, ToSection} = this;
    const {balances: {error}} = this.props;
    return (
      <div className={styles.widget}>

        <FromSection/>

        <ToSection/>

        <div className={styles.buttonsRow}>
          <button data-testid="exchange-btn" onClick={this.exchangeClick}>Exchange</button>
          <div className={styles.operationError}>{error ?? ''}</div>
        </div>
      </div>
    );
  }
}

export default connector(Exchange);
