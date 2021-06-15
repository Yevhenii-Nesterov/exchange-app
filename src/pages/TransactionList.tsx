import React, {useEffect} from 'react';
import {getTransactions} from "../modules/transactions";
import {useAppDispatch, useAppSelector} from "../store/hooks";

const TransactionList: React.FC<{}> = () => {
  const dispatch = useAppDispatch() as (action: any) => Promise<any>;
  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  const {transactions, error, loading} = useAppSelector((state) => state.transactions);

  const content = loading ? 'Loading...' : transactions.map(({id, amount, currency}) => {
    return (
      <li key={id}>
        {currency}: {amount}
      </li>
    );
  });
  return (
    <div>
      <ul>
        {error ?? content}
      </ul>

      <div>
        <button onClick={() => dispatch(getTransactions(true))}>Refresh</button>
      </div>
    </div>
  );
};

export default TransactionList;