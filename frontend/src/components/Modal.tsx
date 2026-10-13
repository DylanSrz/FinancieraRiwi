import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  titulo: string;
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
}

/** Diálogo modal accesible basado en <dialog>. */
export function Modal({ titulo, abierto, onCerrar, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal?.();
    if (!abierto && dialogo.open) dialogo.close?.();
  }, [abierto]);

  return (
    <dialog ref={ref} className="modal" onClose={onCerrar} aria-labelledby="modal-titulo">
      {abierto && (
        <>
          <header className="modal__encabezado">
            <h2 id="modal-titulo">{titulo}</h2>
            <button type="button" className="boton-icono" aria-label="Cerrar" onClick={onCerrar}>
              ×
            </button>
          </header>
          {children}
        </>
      )}
    </dialog>
  );
}
