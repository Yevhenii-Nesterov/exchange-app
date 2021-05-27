import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import connector, {PropsFromState} from './exchange/exchange-store-connector';
import {currencyCode} from "../models/BankAccount";

import styles from './exchange/exchange.module.scss';
import cx from 'classnames';
import {CurrencySelector} from "./exchange/CurrencySelector";
import {AmountInput} from "./exchange/AmountInput";
import {getCurrencySign, getExchangeRate} from "../modules/utils";

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
    const {fromCurrency, toCurrency} = this.state;
    const fromSign = getCurrencySign(fromCurrency);
    const toSign = getCurrencySign(toCurrency);
    const {rates} = this.props;

    let content = rates.error ? rates.error : 'Loading rates...';

    if (rates.rates && !rates.error) {
      const rate = getExchangeRate(rates.rates!, this.state.fromCurrency, this.state.toCurrency);
      content = `${fromSign}1 = ${toSign}${rate.toFixed(5)}`;
    }

    return (
      <div className={styles.rateField} data-testid="exchange-rate">
        {content}
      </div>
    );
  };

  FromSection = () => {
    const {BalanceField} = this;
    const {balances} = this.props;
    const {fromCurrency, toCurrency} = this.state;
    return (
      <section className={cx(styles.currencySection, styles.from)}>

        <div className={styles.leftCol}>

          <CurrencySelector
            data-testid="currency-from"
            selected={fromCurrency}
            codes={Object.keys(balances.balances) as currencyCode[]}
            unavailable={[toCurrency]}
            onSelect={(code) => this.onCurrencyChange(code, "fromCurrency")}
          />

          <BalanceField data-testid="balance-from" account={fromCurrency}/>
        </div>

        <div className={styles.rightCol}>
          <AmountInput
            data-testid="amount-from"
            amount={this.state.fromAmount}
            onAmountChange={(value) => this.onAmountChange(value, 'fromAmount')}
            sign="-"
          />
        </div>

      </section>
    );
  };

  ToSection = () => {
    const {ExchangeRateField, BalanceField} = this;
    const {balances} = this.props;
    const {fromCurrency, toCurrency} = this.state;
    return (
      <section className={cx(styles.currencySection, styles.to)}>
        <div className={styles.leftCol}>

          <CurrencySelector
            data-testid="currency-to"
            selected={toCurrency}
            codes={Object.keys(balances.balances) as currencyCode[]}
            unavailable={[fromCurrency]}
            onSelect={(code) => this.onCurrencyChange(code, "toCurrency")}
          />

          <BalanceField data-testid="balance-to" account={toCurrency}/>
        </div>

        <div className={styles.rightCol}>
          <AmountInput
            data-testid="amount-to"
            amount={this.state.toAmount}
            onAmountChange={(value) => this.onAmountChange(value, 'toAmount')}
            sign="+"
          />
          <ExchangeRateField data-testid="exchange-rate"/>
        </div>


      </section>
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
