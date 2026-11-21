import { useState } from "react";

// Hook para pedir confirmación antes de una acción (editar, eliminar, etc.)
// eslint-disable-next-line react-refresh/only-export-components
export function useConfirmacion() {
  const [confirmacion, setConfirmacion] = useState(null);

  function confirmar(mensaje, accion, esEliminacion = false) {
    setConfirmacion({ mensaje, accion, esEliminacion });
  }

  const dialogo = confirmacion && (
    <DialogoConfirmacion
      {...confirmacion}
      onCancelar={() => setConfirmacion(null)}
      onAceptar={() => {
        const { accion } = confirmacion;
        setConfirmacion(null);
        accion();
      }}
    />
  );

  return { confirmar, dialogo };
}

function DialogoConfirmacion({ mensaje, esEliminacion, onCancelar, onAceptar }) {
  return (
    <div
      className="confirmacion-admin-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancelar();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onCancelar();
          return;
        }
        if (event.key === "Tab") {
          const botones = event.currentTarget.querySelectorAll("button");
          const primero = botones[0];
          const ultimo = botones[botones.length - 1];
          if (event.shiftKey && document.activeElement === primero) {
            event.preventDefault();
            ultimo.focus();
          } else if (!event.shiftKey && document.activeElement === ultimo) {
            event.preventDefault();
            primero.focus();
          }
        }
      }}
    >
      <div
        className={`confirmacion-admin${esEliminacion ? " confirmacion-admin--destructiva" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmacion-admin-titulo"
        aria-describedby="confirmacion-admin-mensaje"
      >
        <span className="confirmacion-admin-icono" aria-hidden="true">
          {esEliminacion ? "!" : "?"}
        </span>
        <h3 id="confirmacion-admin-titulo">¿Confirmas esta acción?</h3>
        <p id="confirmacion-admin-mensaje">{mensaje}</p>
        <div className="confirmacion-admin-acciones">
          <button type="button" className="confirmacion-admin-cancelar" autoFocus onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="confirmacion-admin-aceptar" onClick={onAceptar}>
            {esEliminacion ? "Sí, eliminar" : "Sí, continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DialogoConfirmacion;
