import 'jest';

import {CurrencyRatesProvider} from '../../models/CurrencyRatesProvider';

describe('CurrencyRatesProvider specs', () => {

  beforeEach(() => {
    CurrencyRatesProvider.useMocked = true;
  });

  it('Should return rates', async () => {
    const rates = await CurrencyRatesProvider.getRates();
    expect(rates?.rates).toHaveProperty('USD');
    expect(rates?.rates).toHaveProperty('GBP');
    expect(rates?.rates).toHaveProperty('EUR');
  });

  it('Should return currency names', async () => {
    const currenciesMap = await CurrencyRatesProvider.getCurrencies();
    expect(currenciesMap).toHaveProperty('USD');
    expect(currenciesMap).toHaveProperty('GBP');
    expect(currenciesMap).toHaveProperty('EUR');
  });

  afterEach(() => {
    CurrencyRatesProvider.useMocked = false;
  });
});


