import { useId, useMemo } from 'react';
import { formatCurrency, formatPercent } from '../utils/format.js';

const WIDTH = 560;
const HEIGHT = 200;
const PADDING = 12;

export default function PriceChart({ prices, currency }) {
  const gradientId = `chart-gradient-${useId().replace(/:/g, '')}`;

  const chart = useMemo(() => {
    const points = prices.filter(([, price]) => Number.isFinite(price));

    if (points.length < 2) {
      return null;
    }

    const values = points.map(([, price]) => price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || Math.abs(max) * 0.05 || 1;
    const low = min - range * 0.08;
    const high = max + range * 0.08;
    const span = high - low || 1;
    const usableWidth = WIDTH - PADDING * 2;
    const usableHeight = HEIGHT - PADDING * 2;

    const coordinates = points.map(([, price], index) => {
      const x = PADDING + (index / (points.length - 1)) * usableWidth;
      const y = PADDING + (1 - (price - low) / span) * usableHeight;

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return {
      line: coordinates.join(' '),
      area: `${PADDING},${HEIGHT - PADDING} ${coordinates.join(' ')} ${WIDTH - PADDING},${HEIGHT - PADDING}`,
      min,
      max,
      first: values[0],
      last: values[values.length - 1],
    };
  }, [prices]);

  if (!chart) {
    return <p className="chart__empty">Sem dados suficientes para desenhar o gráfico.</p>;
  }

  const positive = chart.last >= chart.first;
  const stroke = positive ? '#22c55e' : '#ef4444';
  const periodChange = chart.first ? ((chart.last - chart.first) / chart.first) * 100 : 0;

  return (
    <div className="chart">
      <div className="chart__meta">
        <span>Mín. {formatCurrency(chart.min, currency)}</span>
        <span className={`chart__period-change ${positive ? 'up' : 'down'}`}>
          {formatPercent(periodChange)} em 7 dias
        </span>
        <span>Máx. {formatCurrency(chart.max, currency)}</span>
      </div>

      <svg
        className="chart__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Gráfico dos últimos 7 dias, de ${formatCurrency(chart.first, currency)} para ${formatCurrency(chart.last, currency)}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon points={chart.area} fill={`url(#${gradientId})`} />
        <polyline
          points={chart.line}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
