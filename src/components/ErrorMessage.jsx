export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__icon" aria-hidden="true">
        !
      </div>
      <h2>Não foi possível carregar</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button--primary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
