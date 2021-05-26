import {CurrencyRates} from "../models/CurrencyRatesProvider";

const currencyCodeSigns: {[prop: string]: string} = {
  'EUR': '€',
  'GBP': '£',
  'USD': '$'
}

export function getCurrencySign(currencyCode: string): string {
  return currencyCodeSigns[currencyCode.toUpperCase()] ?? currencyCode;
}

export function getExchangeRate(rates: CurrencyRates, from: string, to: string): number {
  const fromRate = rates.rates[from.toUpperCase()]
  const toRate = rates.rates[to.toUpperCase()]
  return toRate / fromRate;
}