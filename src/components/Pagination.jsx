export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Paginação da lista">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Ir para a página anterior"
      >
        ← Anterior
      </button>

      <span>
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Ir para a próxima página"
      >
        Próxima →
      </button>
    </nav>
  );
}
