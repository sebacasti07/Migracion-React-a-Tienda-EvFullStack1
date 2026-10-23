import { useEffect, useState } from "react";
import teclado from "../images/Teclado Mecanico.webp";
import mouse from "../images/Mouse Gamer Pro.webp";
import audifonos from "../images/Audífonos Inalámbricos.webp";
import monitor from "../images/Monitor Gamer.webp";
import silla from "../images/Silla Gamer Ergonómica.webp";
import microfono from "../images/Micrófono USB para Streaming.webp";
import control from "../images/Control Inalámbrico.webp";
import mousepad from "../images/Mousepad XL.webp";
import almacenamiento from "../images/SSD NVMe M.2 1TB Kingston NV3.webp";
import tarjetaVideo from "../images/Tarjeta de Video NVIDIA RTX 3050 8GB.webp";
import memoria from "../images/Memoria RAM DDR4 16GB (2x8GB) 3200MHz.webp";
import gabinete from "../images/Gabinete Gamer ATX Vidrio Templado.webp";
import cooler from "../images/Cooler Líquido 240mm RGB.webp";
import fuente from "../images/Fuente de Poder 650W 80 Plus Bronze.webp";


const diapositivas = [
  {
    imagen: teclado,
    alt: "Teclado Mecánico RGB",
    titulo: "Teclados Mecánicos",
    texto: "Teclados con retroiluminación RGB",
    precio: "Desde $29.990"
  },
  {
    imagen: mouse,
    alt: "Mouse Gamer Pro",
    titulo: "Mouses Gamer",
    texto: "Mouses con alta precisión y ergonomía",
    precio: "Desde $19.990"
  },
  {
    imagen: audifonos,
    alt: "Audífonos Inalámbricos",
    titulo: "Audífonos Inalámbricos",
    texto: "Audífonos con sonido envolvente y cancelación de ruido",
    precio: "Desde $39.990"
  },
  {
    imagen: monitor,
    alt: "Monitor Gamer 24\" 144 Hz",
    titulo: "Monitores Gamer",
    texto: "Monitores con alta tasa de refresco y resolución Full HD",
    precio: "Desde $159.990"
  },
  {
    imagen: silla,
    alt: "Silla Gamer Ergonómica",
    titulo: "Sillas Gamer",
    texto: "Sillas ergonómicas para largas sesiones de juego",
    precio: "Desde $129.990"
  },
  {
    imagen: microfono,
    alt: "Micrófono Streaming",
    titulo: "Micrófonos para Streaming",
    texto: "Micrófonos de alta calidad para transmisiones en vivo",
    precio: "Desde $44.990"
  },
  {
    imagen: control,
    alt: "Control Inalámbrico",
    titulo: "Controles Inalámbricos",
    texto: "Controles inalámbricos para consolas y PC",
    precio: "Desde $34.990"
  },
  {
    imagen: mousepad,
    alt: "Mousepad XL",
    titulo: "Mousepads XL",
    texto: "Mousepads amplios para mayor comodidad y precisión",
    precio: "Desde $12.990"
  },
  {
    imagen: almacenamiento,
    alt: "SSD NVMe M.2 1TB Kingston NV3",
    titulo: "Almacenamiento SSD",
    texto: "Discos SSD NVMe para un rendimiento superior",
    precio: "Desde $64.990"
  },
  {
    imagen: tarjetaVideo,
    alt: "Tarjeta de Video NVIDIA RTX 3050 8GB",
    titulo: "Tarjetas de Video",
    texto: "Tarjetas gráficas de última generación para gaming y diseño",
    precio: "Desde $349.990"
  },
  {
    imagen: memoria,
    alt: "Memoria RAM DDR4 16GB (2x8GB) 3200MHz",
    titulo: "Memorias RAM",
    texto: "Memorias RAM DDR4 de alta velocidad para tu PC",
    precio: "Desde $42.990"
  },
  {
    imagen: gabinete,
    alt: "Gabinete Gamer ATX Vidrio Templado",
    titulo: "Gabinetes Gamer",
    texto: "Gabinetes con diseño moderno y ventilación óptima",
    precio: "Desde $54.990"
  },
  {
    imagen: cooler,
    alt: "Cooler Líquido 240mm RGB",
    titulo: "Coolers Líquidos",
    texto: "Sistemas de enfriamiento líquido para tu CPU",
    precio: "Desde $69.990"
  },
  {
    imagen: fuente,
    alt: "Fuente de Poder 650W 80 Plus Bronze",
    titulo: "Fuentes de Poder",
    texto: "Fuentes de poder eficientes y confiables para tu PC",
    precio: "Desde $52.990"
  }
];

function BannerGamer() {

  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Avance automático cada 2 segundos; se detiene al pasar el mouse,
  // al enfocar un control o si la persona prefiere menos movimiento.
  useEffect(() => {
    const menosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (pausado || menosMovimiento) return;

    const id = setInterval(() => {
      setActual((i) => (i + 1) % diapositivas.length);
    }, 2000);

    return () => clearInterval(id);
  }, [pausado]);

  function anterior() {
    setActual((i) => (i - 1 + diapositivas.length) % diapositivas.length);
  }

  const diapositiva = diapositivas[actual];

  return (
    <div
      className="banner"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <img
        className="banner-imagen"
        src={diapositiva.imagen}
        alt={diapositiva.alt}
      />

      <div className="banner-texto">
        <h2>{diapositiva.titulo}</h2>
        <p>{diapositiva.texto}</p>
        <p className="banner-precio">{diapositiva.precio}</p>
      </div>

      <button
        type="button"
        className="banner-control banner-anterior"
        onClick={anterior}
        aria-label="Diapositiva anterior"
      >
        &#8249;
      </button>

      <div className="banner-indicadores">
        {diapositivas.map((d, i) => (
          <button
            key={d.alt}
            type="button"
            className={i === actual ? "activo" : ""}
            onClick={() => setActual(i)}
            aria-label={`Ir a ${d.titulo}`}
            aria-current={i === actual}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerGamer;
