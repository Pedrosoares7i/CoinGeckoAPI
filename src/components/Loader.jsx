export default function Loader({ label = 'Carregando moedas...', compact = false }) {
  return (
    <div
      className={`loader ${compact ? 'loader--compact' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
