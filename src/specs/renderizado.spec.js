import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { productosDePrueba } from "./ayudantes.jsx";
import ListaProductos from "../components/ListaProductos";
import Carrito from "../components/Carrito";
import CompraFallida from "../pages/CompraFallida";
import Categorias from "../pages/Categorias";
import DetalleOrden from "../components/DetalleOrden";

// PRUEBAS DE RENDERIZADO
// Verifican que los componentes muestren los datos recibidos y que el
// renderizado condicional muestre u oculte elementos según el caso.

describe("Renderizado correcto", () => {
  it("ListaProductos muestra una tarjeta por cada producto del arreglo", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productosDePrueba} agregarAlCarrito={() => {}} />
      </MemoryRouter>
    );
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos.length).toBe(3);
    expect(titulos).toContain("Mouse Gamer Pro");
  });

  it("ListaProductos filtra por categoría y búsqueda", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productosDePrueba} categoria="Periféricos" busqueda="teclado" agregarAlCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Teclado Mecánico RGB")).toBeTruthy();
    expect(screen.queryByText("Mouse Gamer Pro")).toBeNull();
    expect(screen.queryByText('Monitor Gamer 24"')).toBeNull();
  });

  it("Categorias muestra cuántos productos tiene cada categoría", () => {
    render(
      <MemoryRouter>
        <Categorias
          productos={productosDePrueba}
          categorias={[{ id: 1, nombre: "Periféricos", descripcion: "Teclados y mouse" }, { id: 2, nombre: "Monitores", descripcion: "" }]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Periféricos")).toBeTruthy();
    expect(screen.getByText(/2 productos/)).toBeTruthy();
    expect(screen.getByText(/1 producto\b/)).toBeTruthy();
  });

  it("DetalleOrden muestra los productos y el total de la orden", () => {
    const orden = {
      id: 7, fecha: "2026-11-21T16:44:00", estado: "PAGADA", nombre: "Pedro", apellidos: "González",
      correo: "cliente@gmail.com", calle: "Calle 1", region: "Metropolitana de Santiago", comuna: "Santiago", total: 79980,
      detalles: [{ productoId: 1, nombreProducto: "Teclado Mecánico RGB", cantidad: 2, precioUnitario: 39990, subtotal: 79980 }]
    };
    render(<DetalleOrden orden={orden} />);
    expect(screen.getByText("Orden #7")).toBeTruthy();
    expect(screen.getByText("Pagada")).toBeTruthy();
    expect(screen.getAllByText("$79.980").length).toBe(2);
  });
});

describe("Renderizado condicional", () => {
  it("Carrito muestra el mensaje de vacío solo cuando no hay productos", () => {
    const { rerender } = render(
      <MemoryRouter>
        <Carrito carrito={[]} aumentarCantidad={() => {}} disminuirCantidad={() => {}} eliminarDelCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("El carrito está vacío.")).toBeTruthy();
    expect(screen.queryByText("Ir a pagar")).toBeNull();

    rerender(
      <MemoryRouter>
        <Carrito carrito={[{ ...productosDePrueba[0], cantidad: 1 }]} aumentarCantidad={() => {}} disminuirCantidad={() => {}} eliminarDelCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.queryByText("El carrito está vacío.")).toBeNull();
    expect(screen.getByText("Ir a pagar")).toBeTruthy();
  });

  it("CompraFallida muestra el motivo de error que recibe", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/compra-fallida", state: { motivo: "Stock insuficiente para Webcam" } }]}>
        <CompraFallida />
      </MemoryRouter>
    );
    expect(screen.getByRole("alert").textContent).toContain("Stock insuficiente para Webcam");
  });

  it("CompraFallida muestra un mensaje genérico si no llega un motivo", () => {
    render(
      <MemoryRouter>
        <CompraFallida />
      </MemoryRouter>
    );
    expect(screen.getByRole("alert").textContent).toContain("No se pudo procesar el pago.");
  });
});
