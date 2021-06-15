/**
 * @author Yevhenii Nesterov <yevhenii.nesterov@gmail.com>
 */

const BASE_URL = 'http://private-edf52ff-awesomebank.apiary-mock.com/v1/transactions/from/';

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
}

export class TransactionsProvider {
  static async getTransactions(): Promise<Transaction[]> {
    /*return [
      {
        id: '2a1492b6-badd-45eb-b9f0-6b8673d6310b',
        currency: 'EUR',
        amount: 10.01
      },
      {
        id: 'bc9d9fac-e64a-4b09-bb83-01344fda0772',
        currency: 'USD',
        amount: 8.99
      },
    ]*/
    const fromDate = '2020-01-01-11-00-00';
    const toDate = '2020-01-01-12-00-00';
    const url = `${BASE_URL}${fromDate}/to/${toDate}`;
    const response = await fetch(url, {
      method: 'POST'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw Error('HTTP error: ' + response.statusText);
    }
  }

  static async getUpdates(): Promise<Transaction[]> {
    /*return [
      {
        id: '2a1492b6-badd-45eb-b9f0-6b8673d6310b',
        currency: 'EUR',
        amount: 10.01
      },
      {
        id: 'bc9d9fac-e64a-4b09-bb83-01344fda0772',
        currency: 'USD',
        amount: 8.99
      },
    ]*/
    const fromDate = '2020-01-01-12-00-00';
    const toDate = '2020-01-01-13-00-00';
    const url = `${BASE_URL}${fromDate}/to/${toDate}`;
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      throw Error('HTTP error: ' + response.statusText);
    }
  }
}