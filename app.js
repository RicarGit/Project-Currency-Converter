const currencyOneSelect = document.querySelector('[data-js="currency-one"]')
const currencyTwoSelect = document.querySelector('[data-js="currency-two"]')
const currencyOneTimesInput = document
  .querySelector('[data-js="currency-one-times"]')
const convertedValueParagraph = document
  .querySelector('[data-js="converted-value"]')
const conversionPrecisionParagraph = document
  .querySelector('[data-js="conversion-precision"]')

const APIKey = 'e3883a0683a029c56239ccac'

let exchangeRateData = {}

const getCurrencyEndPoint = currency =>
  `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const createOptionElement = () => {
  return document.createElement('option')
}

const displayOptionsWithExchangeData = (currencyRates, currency2) => {
  const currencyDataKeys = Object.keys(currencyRates)

  currencyDataKeys.forEach(key => {
    const option1 = createOptionElement()
    const option2 = createOptionElement()

    option1.textContent = key
    option2.textContent = key

    if (key === currency2) {
      option2.setAttribute('selected', '')
    }

    currencyOneSelect.insertAdjacentElement('beforeend', option1)
    currencyTwoSelect.insertAdjacentElement('beforeend', option2)
  })
}

const fetchExchangeData = async endPoint => {
  try {
    const response = await fetch(endPoint)

    if (response.result === 'error') {
      throw new Error('Não foi possível obter as informações.')
    }

    return response.json()
  } catch (error) {
    alert(error.message)
  }
}

const setExchangeInfo = async currency => {
  const { conversion_rates } = await
    fetchExchangeData(getCurrencyEndPoint(currency))

  displayOptionsWithExchangeData(conversion_rates)
}

setExchangeInfo('USD')
