import { Link } from 'react-router';

export function NoEncontradaPage() {
  return (
    <section className="pagina">
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al panel</Link>
    </section>
  );
}
