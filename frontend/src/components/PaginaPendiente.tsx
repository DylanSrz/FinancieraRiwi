interface Props {
  titulo: string;
  historias: string[];
  descripcion: string;
}

/** Marcador de pantalla mientras se implementa su historia de usuario. Ver docs/diseno/wireframes.md. */
export function PaginaPendiente({ titulo, historias, descripcion }: Props) {
  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>{titulo}</h1>
        <div className="etiquetas">
          {historias.map((hu) => (
            <span key={hu} className="etiqueta">
              {hu}
            </span>
          ))}
        </div>
      </header>
      <p className="pagina__descripcion">{descripcion}</p>
      <div className="pendiente">Pantalla pendiente de implementar.</div>
    </section>
  );
}
