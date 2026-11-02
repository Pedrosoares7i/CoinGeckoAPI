import { useEffect, useRef, useState } from 'react';
import { getCoinById, getMarketChart } from '../services/coingecko.js';
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatPercent,
} from '../utils/format.js';
import Loader from './Loader.jsx';
import PriceChart from './PriceChart.jsx';

function cleanDescription(text) {
  if (!text) {
    return '';
  }

  const plainText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.length > 300 ? `${plainText.slice(0, 300).trimEnd()}…` : plainText;
}

export default function CoinModal({ coin, currency, onClose }) {
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState(null);
  const [detailAttempt, setDetailAttempt] = useState(0);

  const [chartPrices, setChartPrices] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  const [chartAttempt, setChartAttempt] = useState(0);

  const closeButtonRef = useRef(null);

  // Detalhes e gráfico usam requisições separadas para que uma falha não bloqueie a outra.
  useEffect(() => {
    const controller = new AbortController();
    setDetail(null);
    setDetailLoading(true);
    setDetailError(null);

    getCoinById(coin.id, controller.signal)
      .then((data) => {
        setDetail(data);
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') {
          return;
        }

        setDetailError(requestError.message || 'Não foi possível carregar os detalhes.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setDetailLoading(false);
        }
      });

    return () => controller.abort();
  }, [coin.id, detailAttempt]);

  useEffect(() => {
    const controller = new AbortController();
    setChartPrices(null);
    setChartLoading(true);
    setChartError(null);

    getMarketChart(coin.id, currency, controller.signal)
      .then((data) => {
        setChartPrices(Array.isArray(data?.prices) ? data.prices : []);
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') {
          return;
        }

        setChartError(requestError.message || 'Não foi possível carregar o gráfico.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setChartLoading(false);
        }
      });

    return () => controller.abort();
  }, [coin.id, currency, chartAttempt]);

  // Esc, bloqueio do scroll e foco inicial no botão de fechar.
  useEffect(() => {
    const previousFocus = document.activeElement;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  const change = coin.price_change_percentage_24h;
  const hasChange = change !== null && change !== undefined;
  const positive = hasChange && change >= 0;
  const changeClass = !hasChange ? 'neutral' : positive ? 'up' : 'down';
  const rank = coin.market_cap_rank !== null && coin.market_cap_rank !== undefined
    ? `#${coin.market_cap_rank}`
    : '—';

  const high24 = detail?.market_data?.high_24h?.[currency] ?? coin.high_24h;
  const low24 = detail?.market_data?.low_24h?.[currency] ?? coin.low_24h;
  const volume = detail?.market_data?.total_volume?.[currency] ?? coin.total_volume;
  const ath = detail?.market_data?.ath?.[currency] ?? detail?.market_data?.ath?.brl;
  const circulatingSupply = detail?.market_data?.circulating_supply;
  const homepage = detail?.links?.homepage?.find(
    (url) => typeof url === 'string' && url.trim() !== '',
  );
  const description = cleanDescription(detail?.description?.en);

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coin-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar detalhes da moeda"
        >
          ×
        </button>

        <header className="modal__header">
          <img
            src={coin.image}
            alt={`Logo de ${coin.name}`}
            width="56"
            height="56"
            className="modal__logo"
          />
          <div>
            <h2 id="coin-modal-title">
              {coin.name}
              <span>{coin.symbol ? coin.symbol.toUpperCase() : '—'}</span>
            </h2>
            <div className="modal__price">
              <strong>{formatCurrency(coin.current_price, currency)}</strong>
              <span className={`coin-card__change coin-card__change--${changeClass}`}>
                {hasChange ? `${positive ? '▲' : '▼'} ${formatPercent(change)}` : '—'}
              </span>
            </div>
          </div>
          <span className="modal__rank">Ranking {rank}</span>
        </header>

        <div className="modal__content">
          <section className="modal__chart-section" aria-label="Gráfico de preço">
            <div className="modal__section-title">
              <h3>Últimos 7 dias</h3>
            </div>

            {chartLoading && <Loader label="Carregando gráfico..." compact />}

            {!chartLoading && chartError && (
              <div className="modal__inline-error" role="alert">
                <p>{chartError}</p>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setChartAttempt((attempt) => attempt + 1)}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!chartLoading && !chartError && chartPrices && (
              <PriceChart prices={chartPrices} currency={currency} />
            )}
          </section>

          <section className="modal__details" aria-label="Detalhes da moeda">
            <div className="modal__section-title">
              <h3>Detalhes</h3>
            </div>

            {detailLoading && <Loader label="Carregando detalhes..." compact />}

            {!detailLoading && detailError && (
              <div className="modal__inline-error" role="alert">
                <p>{detailError}</p>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setDetailAttempt((attempt) => attempt + 1)}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!detailLoading && !detailError && detail && (
              <>
                <dl className="details-grid">
                  <div>
                    <dt>Máxima 24h</dt>
                    <dd>{formatCurrency(high24, currency)}</dd>
                  </div>
                  <div>
                    <dt>Mínima 24h</dt>
                    <dd>{formatCurrency(low24, currency)}</dd>
                  </div>
                  <div>
                    <dt>Volume 24h</dt>
                    <dd>{formatCurrency(volume, currency)}</dd>
                  </div>
                  <div>
                    <dt>Maior preço histórico</dt>
                    <dd>{formatCurrency(ath, currency)}</dd>
                  </div>
                  <div>
                    <dt>Oferta circulante</dt>
                    <dd>{formatCompactNumber(circulatingSupply)}</dd>
                  </div>
                  <div>
                    <dt>Data de criação</dt>
                    <dd>{formatDate(detail.genesis_date)}</dd>
                  </div>
                </dl>

                <div className="modal__site">
                  <span>Site oficial</span>
                  {homepage ? (
                    <a href={homepage} target="_blank" rel="noreferrer">
                      {homepage.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span>—</span>
                  )}
                </div>

                <div className="modal__description">
                  <h4>Sobre {coin.name}</h4>
                  <p>{description || 'Descrição não disponível.'}</p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
