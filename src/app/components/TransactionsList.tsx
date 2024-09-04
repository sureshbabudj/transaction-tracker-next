import React from 'react';
import Transaction from './Transaction';
import { CommonTransaction } from '../utils/parseCSV';

interface TransactionsListProps {
  transactions: CommonTransaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  return (
    <div>
      {transactions.map((transaction) => (
        <Transaction key={transaction.id} {...transaction} />
      ))}
    </div>
  );
};

export default TransactionsList;
