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

const showAlert = errorMessage => {
  bootstrapAlert.classList.add('show')
  bootstrapAlert.textContent = `Oops! ${errorMessage}`
}

const state = (() => {
  let exchangeRateData = {}

  return {
    getExchangeRateData: () => exchangeRateData,
    setExchangeRateData: newExchangeRateData => {
      if (!newExchangeRateData.conversion_rates) {
        showAlert('O objeto precisa ter uma propriedade conversion_rates')
        return
      }

      exchangeRateData = newExchangeRateData
      return exchangeRateData
    }
  }
})()

const closeAlert = event => event.target.classList.remove('show')
const createOptionElement = () => document.createElement('option')
const getCurrencyEndPoint = currency =>
  `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const getErrorMessage = errorType => ({
  'unsupported-code': 'A moeda não existe em nosso banco de dados.',
  'malformed-request': 'Seu request precisa segruir a estrutura à seguir: https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD',
  'invalid-key': 'Sua chave da API não é válida.',
  'inactive-account': 'Email não confirmado, por favor confirme seu email.',
  'quota-reached': 'Você atingiu o limite de requisições que seu plano pode efetuar.'
})[errorType] || 'Não foi possível obter as informações.'

const fetchExchangeData = async endpoint => {
  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error('Sua conexão falhou. Não foi possível obter os dados.')
    }

    const exchangeData = await response.json()

    if (exchangeData.result === 'error') {
      throw new Error(getErrorMessage(exchangeData['error-type']))
    }

    return exchangeData
  } catch (error) {
    showAlert(error.message)
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

const updateConvertedParagraph = async currency2 => {
  const { conversion_rates } = state.getExchangeRateData()
  convertedValueParagraph.textContent = conversion_rates[currency2].toFixed(2)
}

const updateConversionPrecisionParagraph = (currency1, currency2) => {
  const { conversion_rates } = state.getExchangeRateData()

  conversionPrecisionParagraph.textContent =
    `1 ${currency1} = ${conversion_rates[currency2]} ${currency2}`
}

const updateMultipliedConvertedParagraph = (currency) => {
  const { conversion_rates } = state.getExchangeRateData()

  convertedValueParagraph.textContent =
    (currencyOneTimesInput.value * conversion_rates[currency]).toFixed(2)
}

const setExchangeInfo = async (currency1, currency2) => {
  const endpoint = getCurrencyEndPoint(currency1)
  const { conversion_rates } = state
    .setExchangeRateData(await fetchExchangeData(endpoint))

  fillSelectOptionsWithExchangeData(conversion_rates, currency2)
  updateConversionPrecisionParagraph(currency1, currency2)
  updateConvertedParagraph(currency2)
  updateMultipliedConvertedParagraph(currency2)
}

const displayPrimaryCurrencyValue = async event => {
  const currency1Value = event.target.value
  const currency2Value = currencyTwoSelect.value
  const endpoint = getCurrencyEndPoint(currency1Value)

  state.setExchangeRateData(await fetchExchangeData(endpoint))

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