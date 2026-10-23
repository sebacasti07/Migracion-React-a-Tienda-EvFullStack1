import { useState } from "react";

function CampoContraseña(props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="campo-password">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="boton-mostrar-password"
        aria-controls={props.id}
        aria-pressed={visible}
        onClick={() => setVisible((actual) => !actual)}
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}

export default CampoContraseña;
