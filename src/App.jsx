import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import Filters from './components/Filters.jsx';
import CoinList from './components/CoinList.jsx';
import CoinModal from './components/CoinModal.jsx';
import Pagination from './components/Pagination.jsx';
import Loader from './components/Loader.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import EmptyState from './components/EmptyState.jsx';
import Footer from './components/Footer.jsx';
import { useMarkets } from './hooks/useMarkets.js';
import { useDebounce } from './hooks/useDebounce.js';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'market_cap', label: 'Market cap' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'change_desc', label: 'Maior alta 24h' },
  { value: 'change_asc', label: 'Maior queda 24h' },
];

function compareValues(firstCoin, secondCoin, field, direction) {
  const firstValue = firstCoin[field];
  const secondValue = secondCoin[field];
  const firstMissing = firstValue === null || firstValue === undefined;
  const secondMissing = secondValue === null || secondValue === undefined;

  if (firstMissing && secondMissing) {
    return 0;
  }

  if (firstMissing) {
    return 1;
  }

  if (secondMissing) {
    return -1;
  }

  return direction === 'asc' ? firstValue - secondValue : secondValue - firstValue;
}

function sortCoins(coins, sortBy) {
  const configs = {
    market_cap: ['market_cap', 'desc'],
    price_desc: ['current_price', 'desc'],
    change_desc: ['price_change_percentage_24h', 'desc'],
    change_asc: ['price_change_percentage_24h', 'asc'],
  };
  const [field, direction] = configs[sortBy] || configs.market_cap;

  return [...coins].sort((firstCoin, secondCoin) =>
    compareValues(firstCoin, secondCoin, field, direction),
  );
}

export default function App() {
  const [currency, setCurrency] = useState('brl');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [page, setPage] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const { coins, dataCurrency, loading, error, lastUpdated, refresh } = useMarkets(currency);

  const filteredCoins = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    const matchingCoins = term
      ? coins.filter(
          (coin) =>
            coin.name?.toLowerCase().includes(term) ||
            coin.symbol?.toLowerCase().includes(term),
        )
      : coins;

    return sortCoins(matchingCoins, sortBy);
  }, [coins, debouncedSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCoins.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleCoins = filteredCoins.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Evita exibir dados da moeda anterior enquanto a nova requisição não começa.
  const showLoading = loading || (dataCurrency !== currency && !error);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const closeModal = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} loading={showLoading} onRefresh={refresh} />

      <main className="container main">
        {!showLoading && !error && <SummaryCards coins={filteredCoins} />}

        <Filters
          search={search}
          onSearchChange={handleSearchChange}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOptions={SORT_OPTIONS}
        />

        {showLoading && <Loader />}

        {!showLoading && error && <ErrorMessage message={error} onRetry={refresh} />}

        {!showLoading && !error && (
          <>
            {filteredCoins.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <CoinList
                  coins={visibleCoins}
                  currency={currency}
                  onSelect={setSelectedCoin}
                />
                <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </main>

      <Footer />

      {selectedCoin && (
        <CoinModal coin={selectedCoin} currency={currency} onClose={closeModal} />
      )}
    </div>
  );
}
