import { useCallback, useEffect, useRef, useState } from 'react';

interface Estado<T> {
  clave: string;
  datos: T | null;
  error: string | null;
}

/**
 * Carga datos de la API y expone estado de carga, error y recarga.
 * Vuelve a cargar cuando cambian las dependencias (comparadas por valor) o al llamar `recargar`.
 * Mientras recarga conserva los datos anteriores para no "parpadear".
 */
export function useCarga<T>(cargar: () => Promise<T>, dependencias: unknown[] = []) {
  const [version, setVersion] = useState(0);
  const [estado, setEstado] = useState<Estado<T>>({ clave: '', datos: null, error: null });
  const cargarRef = useRef(cargar);
  const clave = `${JSON.stringify(dependencias)}#${version}`;

  useEffect(() => {
    cargarRef.current = cargar;
  });

  useEffect(() => {
    let vigente = true;
    cargarRef
      .current()
      .then((datos) => vigente && setEstado({ clave, datos, error: null }))
      .catch((e: unknown) => {
        if (!vigente) return;
        const error = e instanceof Error ? e.message : 'Error inesperado';
        setEstado({ clave, datos: null, error });
      });
    return () => {
      vigente = false;
    };
  }, [clave]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  const vigente = estado.clave === clave;

  return {
    datos: estado.datos,
    error: vigente ? estado.error : null,
    cargando: !vigente,
    recargar,
  };
}
