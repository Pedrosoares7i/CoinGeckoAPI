import { formatTime } from '../utils/format.js';

export default function Header({ lastUpdated, loading, onRefresh }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            ₿
          </div>
          <div>
            <h1>CriptoPainel</h1>
            <p>Mercado de criptomoedas em tempo real</p>
          </div>
        </div>

        <div className="header__actions">
          {!loading && lastUpdated && (
            <span className="header__updated">Atualizado às {formatTime(lastUpdated)}</span>
          )}
          <button
            type="button"
            className="button button--primary"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Atualizar dados do mercado"
          >
            <span
              className={`refresh-icon ${loading ? 'refresh-icon--spinning' : ''}`}
              aria-hidden="true"
            >
              ↻
            </span>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>
    </header>
  );
}
