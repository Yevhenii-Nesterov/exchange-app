export type currencyCode = 'USD' | 'GBP' | 'EUR';

export interface AccountBalance {
  currency: currencyCode;
  balance: number;
}

export interface AccountTransfer {
  fromCurrency: currencyCode;
  toCurrency: currencyCode;
  amountInFromCurrency: number;
  exchangeRate: number;
}

export interface TransferResult {
  transfer: AccountTransfer;
  error: string | null;
  balancesEffected: AccountBalance[]
}

const balances: AccountBalance[] = [
  {
    balance: 7690.34,
    currency: "EUR"
  },
  {
    balance: 45656.12,
    currency: "GBP"
  },
  {
    balance: 89.00,
    currency: "USD"
  }
]

export class BankAccount {

  static async makeTransfer(transfer: AccountTransfer): Promise<TransferResult> {
    const {amountInFromCurrency, fromCurrency, toCurrency, exchangeRate} = transfer;
    const fromBalanceId = balances.findIndex(v => v.currency === fromCurrency)
    const toBalanceId = balances.findIndex(v => v.currency === toCurrency)

    if (amountInFromCurrency <= 0) {
      return {
        transfer,
        balancesEffected: [],
        error: 'Invalid amount'
      }
    }

    if (fromBalanceId === -1 || toBalanceId === -1) {
      return {
        transfer,
        balancesEffected: [],
        error: 'Account not found'
      }
    }

    if (balances[fromBalanceId].balance < amountInFromCurrency) {
      return {
        transfer,
        balancesEffected: [],
        error: 'Insufficient balance'
      }
    }

    balances[fromBalanceId].balance -= amountInFromCurrency;
    balances[toBalanceId].balance += amountInFromCurrency * exchangeRate;

    return {
      transfer,
      balancesEffected: [balances[fromBalanceId], balances[toBalanceId]],
      error: null
    }
  }

  static async getBalances(): Promise<AccountBalance[]> {
    return balances;
  }
}