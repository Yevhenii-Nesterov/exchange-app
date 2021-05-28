import 'jest';

import {AccountTransfer, BankAccount} from '../../models/BankAccount';

describe('BankAccount specs', () => {

  it('Should return user balances', async () => {
    const balances = await BankAccount.getBalances();
    expect(balances).toHaveLength(3);
    for (const balance of balances) {
      expect(['USD', 'GBP', 'EUR'].includes(balance.currency)).toBeTruthy();
    }
  });

  it('Should makeTransfer if account balance >= transfer value', async () => {
    const balances = await BankAccount.getBalances();

    const gbpBalance = balances.find((b) => b.currency === "GBP");

    expect(gbpBalance).toBeTruthy();

    const transfer: AccountTransfer = {
      exchangeRate: 2,
      amountInFromCurrency: gbpBalance!.balance,
      fromCurrency: "GBP",
      toCurrency: "EUR"
    };

    const result = await BankAccount.makeTransfer(transfer);

    expect(result.error).toBeFalsy();
    expect(result.balancesEffected).toHaveLength(2);
    expect(result.balancesEffected.find((b) => b.currency === "GBP")).toBeTruthy();
    expect(result.balancesEffected.find((b) => b.currency === "EUR")).toBeTruthy();
  });

  it('Should return error if transfer value >= balance', async () => {
    const balances = await BankAccount.getBalances();

    const gbpBalance = balances.find((b) => b.currency === "GBP");

    expect(gbpBalance).toBeTruthy();

    const transfer: AccountTransfer = {
      exchangeRate: 2,
      amountInFromCurrency: gbpBalance!.balance + 1,
      fromCurrency: "GBP",
      toCurrency: "EUR"
    };

    const result = await BankAccount.makeTransfer(transfer);

    expect(result.error).toBeTruthy();
    expect(result.balancesEffected).toHaveLength(0);
  });
});


