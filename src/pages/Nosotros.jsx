function Nosotros({ contenido }) {
  return (
    <div className="pagina-nosotros">
      <section className="seccion-contacto">
        <h2>{contenido.titulo}</h2>
        <div className="informacion-contacto">
          <div>
            <h3>{contenido.subtitulo}</h3>
            {contenido.parrafos.map((parrafo, index) => <p key={index}>{parrafo}</p>)}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Nosotros;
