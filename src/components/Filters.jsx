export default function Filters({
  search,
  onSearchChange,
  currency,
  onCurrencyChange,
  sortBy,
  onSortChange,
  sortOptions,
}) {
  return (
    <section className="filters" aria-label="Filtros da lista">
      <div className="filters__search">
        <label htmlFor="coin-search">Buscar</label>
        <div className="filters__input-wrapper">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            id="coin-search"
            type="search"
            placeholder="Busque por nome ou símbolo (ex.: bitcoin, btc)"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="filters__field">
        <label htmlFor="currency-select">Moeda</label>
        <select
          id="currency-select"
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value)}
        >
          <option value="brl">BRL (R$)</option>
          <option value="usd">USD (US$)</option>
        </select>
      </div>

      <div className="filters__field">
        <label htmlFor="sort-select">Ordenar por</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
