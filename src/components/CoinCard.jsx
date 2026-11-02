import { formatCompact, formatCurrency, formatPercent } from '../utils/format.js';

export default function CoinCard({ coin, currency, onSelect }) {
  const change = coin.price_change_percentage_24h;
  const hasChange = change !== null && change !== undefined;
  const positive = hasChange && change >= 0;
  const changeClass = !hasChange ? 'neutral' : positive ? 'up' : 'down';
  const arrow = !hasChange ? '' : positive ? '▲' : '▼';
  const rank = coin.market_cap_rank !== null && coin.market_cap_rank !== undefined
    ? `#${coin.market_cap_rank}`
    : '—';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(coin);
    }
  };

  return (
    <article
      className="coin-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(coin)}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalhes de ${coin.name}`}
    >
      <header className="coin-card__header">
        <img
          className="coin-card__image"
          src={coin.image}
          alt={`Logo de ${coin.name}`}
          width="40"
          height="40"
          loading="lazy"
        />
        <div className="coin-card__identity">
          <h3>{coin.name}</h3>
          <span>{coin.symbol ? coin.symbol.toUpperCase() : '—'}</span>
        </div>
        <span className="coin-card__rank" title="Ranking de market cap">
          {rank}
        </span>
      </header>

      <div className="coin-card__price-row">
        <strong className="coin-card__price">{formatCurrency(coin.current_price, currency)}</strong>
        <span className={`coin-card__change coin-card__change--${changeClass}`}>
          {hasChange ? `${arrow} ${formatPercent(change)}` : '—'}
        </span>
      </div>

      <div className="coin-card__footer">
        <span>Market cap</span>
        <strong>{formatCompact(coin.market_cap, currency)}</strong>
      </div>
    </article>
  );
}
