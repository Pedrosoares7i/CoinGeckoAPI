const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// 429 é o limite de requisições; 401/403 indicam chave ausente ou inválida.
function createStatusError(status) {
  if (status === 429) {
    return new Error('Muitas requisições. Aguarde um minuto e tente novamente.');
  }

  if (status === 401 || status === 403) {
    return new Error('Chave de API ausente ou inválida. Veja o README.');
  }

  return new Error('Não foi possível carregar os dados. Tente novamente em instantes.');
}

async function request(path, signal) {
  const headers = { accept: 'application/json' };

  // A chave é opcional: o plano público funciona sem header.
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, { headers, signal });
  } catch (error) {
    // AbortError não é uma falha real: a requisição apenas foi cancelada.
    if (error.name === 'AbortError') {
      throw error;
    }

    throw new Error('Falha de rede. Verifique sua conexão e tente novamente.');
  }

  // Traduz o status HTTP em uma mensagem amigável para a interface.
  if (!response.ok) {
    throw createStatusError(response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('A resposta da API não pôde ser lida. Tente novamente.');
  }
}

export function getMarkets({ currency, signal }) {
  const query = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: '100',
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  return request(`/coins/markets?${query.toString()}`, signal);
}

export function getCoinById(id, signal) {
  const query = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    community_data: 'false',
    developer_data: 'false',
  });

  return request(`/coins/${encodeURIComponent(id)}?${query.toString()}`, signal);
}

export function getMarketChart(id, currency, signal) {
  const query = new URLSearchParams({
    vs_currency: currency,
    days: '7',
  });

  return request(`/coins/${encodeURIComponent(id)}/market_chart?${query.toString()}`, signal);
}
