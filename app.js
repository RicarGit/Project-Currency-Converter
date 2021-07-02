const currencyOneSelect = document.querySelector('[data-js="currency-one"]')
const currencyTwoSelect = document.querySelector('[data-js="currency-two"]')
const currencyOneTimesInput = document
  .querySelector('[data-js="currency-one-times"]')
const convertedValueParagraph = document
  .querySelector('[data-js="converted-value"]')
const conversionPrecisionParagraph = document
  .querySelector('[data-js="conversion-precision"]')

const APIKey = 'e3883a0683a029c56239ccac'
const requestURL = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/USD`