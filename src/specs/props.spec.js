import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { productosDePrueba } from "./ayudantes.jsx";
import Producto from "../components/Producto";
import PrecioProducto from "../components/PrecioProducto";
import NavbarLateral from "../components/NavbarLateral";

// PRUEBAS DE PROPIEDADES (props)
// Confirman que los componentes reciben y usan correctamente sus props.

describe("Props de Producto", () => {
  it("Recibe el producto y muestra su nombre y precio", () => {
    render(
      <MemoryRouter>
        <Producto producto={productosDePrueba[2]} agregarAlCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Monitor Gamer 24"')).toBeTruthy();
    expect(screen.getByText("$159.990")).toBeTruthy();
  });

  it("El botón tiene la etiqueta correcta y ejecuta la función onClick recibida", async () => {
    const agregar = jasmine.createSpy("agregarAlCarrito");
    render(
      <MemoryRouter>
        <Producto producto={productosDePrueba[0]} agregarAlCarrito={agregar} />
      </MemoryRouter>
    );
    const boton = screen.getByRole("button", { name: "Agregar al carrito" });
    await userEvent.click(boton);
    expect(agregar).toHaveBeenCalledOnceWith(productosDePrueba[0]);
  });

  it("Con mostrarAgregar=false no muestra el botón (rol vendedor)", () => {
    render(
      <MemoryRouter>
        <Producto producto={productosDePrueba[0]} agregarAlCarrito={() => {}} mostrarAgregar={false} />
      </MemoryRouter>
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("Si el stock es 0 el botón se deshabilita", () => {
    render(
      <MemoryRouter>
        <Producto producto={productosDePrueba[1]} agregarAlCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: "Sin stock" }).disabled).toBeTrue();
  });
});

describe("Props de PrecioProducto y NavbarLateral", () => {
  it("PrecioProducto tacha el precio normal cuando enOferta es true", () => {
    render(<PrecioProducto producto={productosDePrueba[0]} />);
    expect(screen.getByText("$49.990").className).toContain("text-decoration-line-through");
    expect(screen.getByText("$39.990")).toBeTruthy();
  });

  it("NavbarLateral crea un enlace por cada categoría recibida", () => {
    render(
      <MemoryRouter>
        <NavbarLateral productos={productosDePrueba} categorias={[{ id: 1, nombre: "Periféricos" }, { id: 2, nombre: "Monitores" }]} />
      </MemoryRouter>
    );
    const enlace = screen.getByRole("link", { name: "Monitores" });
    expect(enlace.getAttribute("href")).toBe("/productos?categoria=Monitores");
  });

  it("NavbarLateral oculta el carrito si mostrarCarrito es false", () => {
    render(
      <MemoryRouter>
        <NavbarLateral productos={productosDePrueba} mostrarCarrito={false} />
      </MemoryRouter>
    );
    expect(screen.queryByText("Mi carrito")).toBeNull();
  });
});
