// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');
    const apiKey = 'YOUR_API_KEY'; // Substitua por sua chave de API

    // Função para buscar a lista de moedas
    async function fetchCurrencies() {
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const data = await response.json();
        populateSelect(fromCurrency, data.rates);
        populateSelect(toCurrency, data.rates);
    }

    // Função para preencher os selects
    function populateSelect(selectElement, data) {
        for (const currency in data) {
            const option = document.createElement('option');
            option.value = currency;
            option.text = currency;
            selectElement.appendChild(option);
        }
    }

    // Função para buscar a taxa de câmbio e calcular o valor
    async function fetchExchangeRate(from, to) {
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await response.json();
        const rate = data.rates[to];
        return rate;
    }

    // Função para validar e formatar a entrada
    function validateAmount(value) {
        // Remove caracteres não numéricos, exceto a vírgula e pontos decimais
        const sanitizedValue = value.replace(/[^0-9.,]/g, '');

        // Verifica se a entrada contém apenas números e, no máximo, duas casas decimais
        const regex = /^\d+(\.\d{1,2})?$/;
        if (regex.test(sanitizedValue)) {
            // Formata o valor para duas casas decimais
            return parseFloat(sanitizedValue).toFixed(2);
        }
        return null;
    }

    // Evento de clique no botão de converter
    convertBtn.addEventListener('click', async function() {
        const amountText = amountInput.value.trim();
        const from = fromCurrency.value;
        const to = toCurrency.value;

        // Valida e formata o valor inserido
        const amount = validateAmount(amountText);

        if (from === to) {
            resultDiv.textContent = 'Por favor, selecione moedas diferentes.';
            return; // Interrompe a execução se as moedas forem iguais
        }

        if (amount && from && to) {
            const rate = await fetchExchangeRate(from, to);
            const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
            resultDiv.textContent = `${convertedAmount} ${to}`;
        } else {
            resultDiv.textContent = 'Por favor, insira um valor válido e selecione as moedas.';
        }
    });

    // Chama a função para buscar a lista de moedas quando a página carrega
    fetchCurrencies();
});
