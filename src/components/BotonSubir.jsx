import { useEffect, useState } from "react";

function BotonSubir() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function actualizarVisibilidad() {
      setVisible(window.scrollY > 250);
    }

    actualizarVisibilidad();
    window.addEventListener("scroll", actualizarVisibilidad, { passive: true });

    return () => window.removeEventListener("scroll", actualizarVisibilidad);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="boton-subir"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
    >
      ↑ Subir
    </button>
  );
}

export default BotonSubir;
