import React, {ChangeEvent} from 'react'
import styles from './exchange.module.scss';

import cx from 'classnames'

export interface CurrencySelectorProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  sign: string;
}

const valueMatcher = /^\d+(\.\d{0,2})?$/

const trimNumber = (num: string) => Number(num).toString()

export function AmountInput(props: CurrencySelectorProps) {
  const {amount, onAmountChange, sign} = props;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      onAmountChange(value);
    }

    const numberVal = Number(value);
    if (isNaN(numberVal) || !valueMatcher.test(value) || value === '0.00') {
      return;
    }

    const dotAtTheEnd = value.endsWith('.');
    const [whole, fractional] = value.split('.')

    onAmountChange(trimNumber(whole) + (dotAtTheEnd ? '.' : (fractional ? '.' + fractional : '')));
  }

  const hasValue = amount !== '' && Number(amount) > 0;

  return (
    <div className={styles.amountInputWrap}>
      <span className={cx(styles.sign, {[styles.hasValue]: hasValue})}>{sign}</span><input type="numeric"
                                                                                  value={amount}
                                                                                  onChange={onChange}/>
    </div>
  )
}