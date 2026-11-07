import numeral from 'numeral';
import { ToWords } from 'to-words';
// eslint-disable-next-line import/no-extraneous-dependencies
import fmt from 'indian-number-format';

// ----------------------------------------------------------------------
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});

export function fNumber(number) {
  return numeral(number).format();
}

export function FIndian(number) {
  return fmt.format(number);
}

export function FFIndian(number) {
  return fmt.formatFixed(number, 2);
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('₹0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

export function fCurrencyWords(currency = 0) {
  return toWords.convert(currency);
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
