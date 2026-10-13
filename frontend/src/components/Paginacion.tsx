interface Props {
  pagina: number;
  porPagina: number;
  total: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, porPagina, total, onCambiar }: Props) {
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  return (
    <nav className="paginacion" aria-label="Paginación">
      <span>
        {total} registro{total === 1 ? '' : 's'} · página {pagina} de {paginas}
      </span>
      <button
        type="button"
        className="boton-secundario"
        disabled={pagina <= 1}
        onClick={() => onCambiar(pagina - 1)}
      >
        ‹ Anterior
      </button>
      <button
        type="button"
        className="boton-secundario"
        disabled={pagina >= paginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente ›
      </button>
    </nav>
  );
}
