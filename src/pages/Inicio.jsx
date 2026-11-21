import videoGamer from "../images/video_gamer.mp4";
import { useAuth } from "../context/AuthContext";
import FormularioContacto from "../components/FormularioContacto";

function Inicio({ contenido }) {
  const { usuario } = useAuth();

  return (
    <div className="pagina-inicio">
      <section className="bienvenida">
        <h2>Video de Lanzamiento</h2>
        <p>
          {usuario
            ? `Hola ${usuario.nombre}, conoce nuestra tienda y catálogo de productos.`
            : "Inicia sesión para comprar en nuestra tienda y revisar tus pedidos."}
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

        <FormularioContacto />
      </section>
    </div>
  );
}

export default Inicio;