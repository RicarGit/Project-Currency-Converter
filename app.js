const currencyOneSelect = document.querySelector('[data-js="currency-one"]')
const currencyTwoSelect = document.querySelector('[data-js="currency-two"]')
const currencyOneTimesInput = document
  .querySelector('[data-js="currency-one-times"]')
const convertedValueParagraph = document
  .querySelector('[data-js="converted-value"]')
const conversionPrecisionParagraph = document
  .querySelector('[data-js="conversion-precision"]')
const bootstrapAlert = document.querySelector('.alert')

const APIKey = 'e3883a0683a029c56239ccac'
let exchangeRateData = {}

const closeAlert = event => event.target.classList.remove('show')
const createOptionElement = () => document.createElement('option')
const getCurrencyEndPoint = currency =>
  `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const fetchExchangeData = async endpoint => {
  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error('Sua conexão falhou. Não foi possível obter os dados.')
    }

    const exchangeData = await response.json()

    if (exchangeData.result === 'error') {
      throw new Error(exchangeData['error-type'])
    }

    return exchangeData
  } catch (error) {
    bootstrapAlert.classList.add('show')
    bootstrapAlert.textContent = error
  }
}

const fillSelectOptionsWithExchangeData = (currencyRates, currency2) => {
  const currencyDataKeys = Object.keys(currencyRates)

  currencyDataKeys.forEach(key => {
    const primaryOption = createOptionElement()
    const secondaryOption = createOptionElement()

    primaryOption.textContent = key
    secondaryOption.textContent = key

    if (key === currency2) {
      secondaryOption.setAttribute('selected', '')
    }

    currencyOneSelect.insertAdjacentElement('beforeend', primaryOption)
    currencyTwoSelect.insertAdjacentElement('beforeend', secondaryOption)
  })
}

const updateConvertedParagraph = currency2 => {
  const { conversion_rates } = exchangeRateData
  convertedValueParagraph.textContent = conversion_rates[currency2].toFixed(2)
}

const updateConversionPrecisionParagraph = (currency1, currency2) => {
  const { conversion_rates } = exchangeRateData

  conversionPrecisionParagraph.textContent =
    `1 ${currency1} = ${conversion_rates[currency2]} ${currency2}`
}

const updateMultipliedConvertedParagraph = (currency) => {
  const { conversion_rates } = exchangeRateData

  convertedValueParagraph.textContent =
    (currencyOneTimesInput.value * conversion_rates[currency]).toFixed(2)
}

const setExchangeInfo = async (currency1, currency2) => {
  const endpoint = getCurrencyEndPoint(currency1)
  exchangeRateData = await fetchExchangeData(endpoint)
  const { conversion_rates } = exchangeRateData

  fillSelectOptionsWithExchangeData(conversion_rates, currency2)
  updateConversionPrecisionParagraph(currency1, currency2)
  updateConvertedParagraph(currency2)
  updateMultipliedConvertedParagraph(currency2)
}

const displayPrimaryCurrencyValue = async event => {
  const currency1Value = event.target.value
  const currency2Value = currencyTwoSelect.value
  const endpoint = getCurrencyEndPoint(currency1Value)

  exchangeRateData = await fetchExchangeData(endpoint)

  updateConversionPrecisionParagraph(currency1Value, currency2Value)
  updateConvertedParagraph(currency2Value)
  updateMultipliedConvertedParagraph(currency2Value)
}

const displaySecondaryCurrencyValue = event => {
  const currency1Value = currencyOneSelect.value
  const currency2Value = event.target.value

  updateConversionPrecisionParagraph(currency1Value, currency2Value)
  updateConvertedParagraph(currency2Value)
  updateMultipliedConvertedParagraph(currency2Value)
}

const multiplyCurrentCurrency = () => {
  const currency2Value = currencyTwoSelect.value
  updateMultipliedConvertedParagraph(currency2Value)
}

currencyOneSelect.addEventListener('input', displayPrimaryCurrencyValue)
currencyTwoSelect.addEventListener('input', displaySecondaryCurrencyValue)
currencyOneTimesInput.addEventListener('input', multiplyCurrentCurrency)
bootstrapAlert.addEventListener('click', closeAlert)

setExchangeInfo('USD', 'BRL')