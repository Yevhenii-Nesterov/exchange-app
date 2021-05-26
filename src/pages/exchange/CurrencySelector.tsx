import React from 'react'
import styles from './exchange.module.scss';

import cx from 'classnames'
import {currencyCode} from "../../models/BankAccount";

export interface CurrencySelectorProps {
  onSelect: (code: currencyCode) => void;
  selected: currencyCode;
  unavailable: currencyCode[];
  codes: currencyCode[];
}

export function CurrencySelector(props: CurrencySelectorProps) {
  const {codes, unavailable, selected, onSelect} = props;

  const items = codes.map(code => {
    const inactive = unavailable.includes(code);
    const selectedItem = selected === code;
    return (
      <div key={code}
           className={cx(styles.currencyItem, {[styles.inactive]: inactive, [styles.selected]: selectedItem})}
           onClick={() => !inactive && onSelect(code)}
      >
        {code.toUpperCase()}
      </div>
    )
  });

  return (
    <div className={styles.currencySelector }>
      {items}
    </div>
  )
}