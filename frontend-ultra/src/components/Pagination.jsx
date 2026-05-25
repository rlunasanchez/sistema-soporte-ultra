import { useMemo } from 'react';

function getItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items = [];

  items.push(1);

  if (current > 3) {
    items.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2 && current <= 3) {
    for (let i = 2; i < current; i++) items.push(i);
  }

  if (start <= end) {
    for (let i = start; i <= end; i++) {
      items.push(i);
    }
  }

  if (current < total - 2) {
    items.push('...');
  }

  items.push(total);

  return items;
}

function Pagination({ currentPage, totalPages, pageSize, totalItems, onPageChange }) {
  const items = useMemo(() => getItems(currentPage, totalPages), [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const from = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min((currentPage - 1) * pageSize + pageSize, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Mostrando {from} - {to} de {totalItems} registros
      </div>
      <div className="pagination-controls">
        <button className="page-btn-nav" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          ‹
        </button>
        <span className="page-numbers-desktop">
          {items.map((item, i) =>
            item === '...' ? (
              <span key={`e${i}`} className="pagination-ellipsis">...</span>
            ) : (
              <button key={item} onClick={() => onPageChange(item)} className={currentPage === item ? 'active' : ''}>
                {item}
              </button>
            )
          )}
        </span>
        <button className="page-btn-nav" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;
