import teclado from "../images/Teclado Mecanico.webp";
import mouse from "../images/Mouse Gamer Pro.webp";
import audifonos from "../images/Audífonos Inalámbricos.webp";
import monitor from "../images/Monitor Gamer.webp";
import silla from "../images/Silla Gamer Ergonómica.webp";
import mousepad from "../images/Mousepad XL.webp";
import microfono from "../images/Micrófono USB para Streaming.webp";
import control from "../images/Control Inalámbrico.webp";
import almacenamiento from "../images/SSD NVMe M.2 1TB Kingston NV3.webp";
import tarjetaVideo from "../images/Tarjeta de Video NVIDIA RTX 3050 8GB.webp";
import memoria from "../images/Memoria RAM DDR4 16GB (2x8GB) 3200MHz.webp";
import gabinete from "../images/Gabinete Gamer ATX Vidrio Templado.webp";
import cooler from "../images/Cooler Líquido 240mm RGB.webp";
import fuente from "../images/Fuente de Poder 650W 80 Plus Bronze.webp";

// La webcam no tiene una imagen local y conserva su emoji como marcador.
const productos = [
  { id: 1, nombre: "Teclado Mecánico RGB", precio: 49990, emoji: "⌨️", imagen: teclado, categoria: "Periféricos", descripcion: "Teclado mecánico con iluminación RGB, ideal para jugar y escribir con respuesta precisa." },
  { id: 2, nombre: "Mouse Gamer Pro", precio: 29990, emoji: "🖱️", imagen: mouse, categoria: "Periféricos", descripcion: "Mouse gamer diseñado para ofrecer control preciso y comodidad durante largas sesiones." },
  { id: 3, nombre: "Audífonos Inalámbricos", precio: 39990, emoji: "🎧", imagen: audifonos, categoria: "Periféricos", descripcion: "Audífonos inalámbricos para disfrutar de audio envolvente y moverte con libertad." },
  { id: 4, nombre: "Monitor Gamer 24\" 144 Hz", precio: 159990, emoji: "🖥️", imagen: monitor, categoria: "Monitores", descripcion: "Monitor gamer de 24 pulgadas y 144 Hz para una imagen fluida en tus juegos." },
  { id: 5, nombre: "Silla Gamer Ergonómica", precio: 129990, emoji: "💺", imagen: silla, categoria: "Accesorios", descripcion: "Silla ergonómica que brinda soporte y comodidad para jugar o trabajar." },
  { id: 6, nombre: "Mousepad XL", precio: 12990, emoji: "🎯", imagen: mousepad, categoria: "Accesorios", descripcion: "Superficie amplia para mover el mouse con comodidad y mantenerlo bajo control." },
  { id: 7, nombre: "Micrófono Streaming", precio: 44990, emoji: "🎙️", imagen: microfono, categoria: "Periféricos", descripcion: "Micrófono USB pensado para streaming, videollamadas y grabaciones con voz clara." },
  { id: 8, nombre: "Control Inalámbrico", precio: 34990, emoji: "🎮", imagen: control, categoria: "Periféricos", descripcion: "Control inalámbrico para jugar con comodidad y libertad de movimiento." },
  { id: 9, nombre: "Webcam Full 4k", precio: 39990, emoji: "📷", imagen: "", categoria: "Periféricos", descripcion: "Webcam 4K para videollamadas, transmisiones y creación de contenido." },
  { id: 10, nombre: "SSD NVMe M.2 1TB Kingston NV3", precio: 64990, emoji: "💾", imagen: almacenamiento, categoria: "Componentes Gamers", descripcion: "Unidad SSD NVMe M.2 de 1 TB para acelerar el inicio del sistema y la carga de aplicaciones." },
  { id: 11, nombre: "Tarjeta de Video NVIDIA RTX 3050 8GB", precio: 349990, emoji: "📟", imagen: tarjetaVideo, categoria: "Componentes Gamers", descripcion: "Tarjeta gráfica NVIDIA RTX 3050 con 8 GB de memoria para jugar y crear contenido." },
  { id: 12, nombre: "Memoria RAM DDR4 16GB (2x8GB) 3200MHz", precio: 42990, emoji: "⚡", imagen: memoria, categoria: "Componentes Gamers", descripcion: "Kit de memoria DDR4 de 16 GB (2 x 8 GB) a 3200 MHz para mejorar la capacidad de respuesta del equipo." },
  { id: 13, nombre: "Gabinete Gamer ATX Vidrio Templado", precio: 54990, emoji: "📦", imagen: gabinete, categoria: "Computadores", descripcion: "Gabinete ATX con panel de vidrio templado para exhibir y organizar los componentes del PC." },
  { id: 14, nombre: "Cooler Líquido 240mm RGB", precio: 69990, emoji: "❄️", imagen: cooler, categoria: "Componentes Gamers", descripcion: "Sistema de refrigeración líquida de 240 mm con iluminación RGB para mantener el procesador refrigerado." },
  { id: 15, nombre: "Fuente de Poder 650W 80 Plus Bronze", precio: 52990, emoji: "🔌", imagen: fuente, categoria: "Componentes Gamers", descripcion: "Fuente de poder de 650 W con certificación 80 Plus Bronze para alimentar tu equipo." }
];

export default productos;