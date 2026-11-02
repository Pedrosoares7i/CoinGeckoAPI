import { useCallback, useEffect, useState } from 'react';
import { getMarkets } from '../services/coingecko.js';

const CACHE_TTL = 60 * 1000;
const cache = new Map();

export function useMarkets(currency) {
  const [coins, setCoins] = useState([]);
  const [dataCurrency, setDataCurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => {
    setRefreshIndex((index) => index + 1);
  }, []);

  useEffect(() => {
    const cached = cache.get(currency);
    const cacheIsValid = cached && Date.now() - cached.fetchedAt < CACHE_TTL;

    // Cache de 60 s: clicar em "Atualizar" antes disso reutiliza os dados.
    if (cacheIsValid) {
      setCoins(cached.coins);
      setDataCurrency(currency);
      setLastUpdated(new Date(cached.fetchedAt));
      setError(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getMarkets({ currency, signal: controller.signal })
      .then((data) => {
        cache.set(currency, { coins: data, fetchedAt: Date.now() });
        setCoins(data);
        setDataCurrency(currency);
        setLastUpdated(new Date());
        setError(null);
      })
      .catch((requestError) => {
        // AbortError acontece quando trocamos de moeda ou saímos da tela.
        if (requestError.name === 'AbortError') {
          return;
        }

        setError(requestError.message || 'Não foi possível carregar os dados.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    // Cancela a requisição anterior sempre que a dependência mudar.
    return () => controller.abort();
  }, [currency, refreshIndex]);

  return {
    coins,
    dataCurrency,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}
