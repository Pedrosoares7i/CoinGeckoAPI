import { formatPercent } from '../utils/format.js';

function findMover(coins, direction) {
  return coins.reduce((selected, coin) => {
    const change = coin.price_change_percentage_24h;

    if (change === null || change === undefined) {
      return selected;
    }

    if (!selected) {
      return coin;
    }

    const selectedChange = selected.price_change_percentage_24h;
    const isBetter =
      direction === 'up' ? change > selectedChange : change < selectedChange;

    return isBetter ? coin : selected;
  }, null);
}

export default function SummaryCards({ coins }) {
  const topGainer = findMover(coins, 'up');
  const topLoser = findMover(coins, 'down');

  return (
    <section className="summary" aria-label="Resumo do mercado">
      <article className="summary-card">
        <span className="summary-card__label">Maior alta 24h</span>
        {topGainer ? (
          <>
            <strong className="summary-card__value summary-card__value--up">{topGainer.name}</strong>
            <span className="summary-card__meta">
              {formatPercent(topGainer.price_change_percentage_24h)}
            </span>
          </>
        ) : (
          <strong className="summary-card__value">—</strong>
        )}
      </article>

      <article className="summary-card">
        <span className="summary-card__label">Maior queda 24h</span>
        {topLoser ? (
          <>
            <strong className="summary-card__value summary-card__value--down">{topLoser.name}</strong>
            <span className="summary-card__meta">
              {formatPercent(topLoser.price_change_percentage_24h)}
            </span>
          </>
        ) : (
          <strong className="summary-card__value">—</strong>
        )}
      </article>

      <article className="summary-card">
        <span className="summary-card__label">Moedas exibidas</span>
        <strong className="summary-card__value summary-card__value--accent">{coins.length}</strong>
        <span className="summary-card__meta">no resultado atual</span>
      </article>
    </section>
  );
}
