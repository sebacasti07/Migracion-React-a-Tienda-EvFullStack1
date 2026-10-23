import videoGamer from "../images/video_gamer.mp4";

function Inicio({ contenido }) {
  const usuario = sessionStorage.getItem("usuario");

  return (
    <div className="pagina-inicio">
      <section className="bienvenida">
        <h2>Video de Lanzamiento</h2>
        <p>
          {usuario
            ? "Conoce nuestra tienda y catálogo de productos."
            : "Inicia sesión para acceder a nuestra tienda y catálogo de productos."}
        </p>
        <div className="contenedor-video">
          <video
            src={videoGamer}
            title="Video promocional gamer"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
          >
            Tu navegador no admite la reproducción de video.
          </video>
        </div>
      </section>

      <section id="contacto" className="seccion-contacto">
        <h2>Contacto</h2>
        <div className="informacion-contacto">
          <div>
            <h3>Visítanos</h3>
            <p>Dirección: {contenido.contacto.direccion}</p>
            <div className="cuadro-redes">
              <h3>Redes sociales</h3>
              <a
                className="boton-red-social"
                href={contenido.contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-red-social"
                  src="https://cdn.simpleicons.org/whatsapp/25D366"
                  alt="WhatsApp"
                />
                WhatsApp
              </a>
              <a
                className="boton-red-social"
                href={contenido.contacto.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-red-social"
                  src="https://cdn.simpleicons.org/facebook/1877F2"
                  alt="Facebook"
                />
                Facebook
              </a>
              <a
                className="boton-red-social"
                href={contenido.contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-red-social"
                  src="https://cdn.simpleicons.org/instagram/E4405F"
                  alt="Instagram"
                />
                Instagram
              </a>
              <a
                className="boton-red-social"
                href={contenido.contacto.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-red-social"
                  src="https://cdn.simpleicons.org/tiktok/FFFFFF"
                  alt="TikTok"
                />
                TikTok
              </a>
            </div>
          </div>

          <div className="mapa-contacto">
            <iframe
              src={contenido.contacto.mapaUrl}
              title="Mapa de nuestra dirección"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <form id="formularioContacto" className="formulario-contacto" noValidate>
          <h3>Escríbenos</h3>
          <label htmlFor="nombreContacto">Nombre</label>
          <input id="nombreContacto" name="nombreContacto" maxLength={100} required />
          <span id="errorNombreContacto" className="mensaje-error"></span>

          <label htmlFor="correoContacto">Correo</label>
          <input id="correoContacto" name="correoContacto" type="email" required />
          <span id="errorCorreoContacto" className="mensaje-error"></span>

          <label htmlFor="mensajeContacto">Mensaje</label>
          <textarea id="mensajeContacto" name="mensajeContacto" maxLength={500} required></textarea>
          <span id="errorMensajeContacto" className="mensaje-error"></span>

          <button type="submit">Enviar mensaje</button>
          <p id="mensajeContactoExitoso" className="mensaje-exito"></p>
        </form>
      </section>
    </div>
  );
}

export default Inicio;