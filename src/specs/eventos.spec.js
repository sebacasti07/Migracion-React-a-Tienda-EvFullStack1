import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { productosDePrueba } from "./ayudantes.jsx";
import Carrito from "../components/Carrito";
import FormularioContacto from "../components/FormularioContacto";
import CrearUsuario from "../pages/CrearUsuario";
import { AuthProvider } from "../context/AuthContext";
import { authApi } from "../api/servicios";

// PRUEBAS DE EVENTOS
// Simulan acciones del usuario (clic, escribir, enviar) y revisan la reacción del componente.

describe("Simulación de eventos", () => {
  beforeEach(() => localStorage.clear());

  it("Los botones +, − y Eliminar del carrito llaman a su función con el id del producto", async () => {
    const aumentar = jasmine.createSpy("aumentarCantidad");
    const disminuir = jasmine.createSpy("disminuirCantidad");
    const eliminar = jasmine.createSpy("eliminarDelCarrito");
    render(
      <MemoryRouter>
        <Carrito
          carrito={[{ ...productosDePrueba[0], cantidad: 2 }]}
          aumentarCantidad={aumentar}
          disminuirCantidad={disminuir}
          eliminarDelCarrito={eliminar}
        />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /Agregar una unidad/ }));
    await userEvent.click(screen.getByRole("button", { name: /Quitar una unidad/ }));
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(aumentar).toHaveBeenCalledWith(1);
    expect(disminuir).toHaveBeenCalledWith(1);
    expect(eliminar).toHaveBeenCalledWith(1);
  });

  it("El botón + se deshabilita cuando la cantidad llega al stock", () => {
    render(
      <MemoryRouter>
        <Carrito carrito={[{ ...productosDePrueba[2], cantidad: 3 }]} aumentarCantidad={() => {}} disminuirCantidad={() => {}} eliminarDelCarrito={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Agregar una unidad/ }).disabled).toBeTrue();
  });

  it("Al enviar el contacto vacío se muestran los mensajes de error", async () => {
    render(<FormularioContacto />);
    await userEvent.click(screen.getByRole("button", { name: /Enviar mensaje/ }));
    expect(screen.getByText("Ingresa tu nombre.")).toBeTruthy();
    expect(screen.getByText("Escribe tu mensaje.")).toBeTruthy();
  });

  it("El registro con RUN inválido muestra error y no llama a la API", async () => {
    const registro = spyOn(authApi, "registro");
    render(
      <AuthProvider>
        <MemoryRouter>
          <CrearUsuario />
        </MemoryRouter>
      </AuthProvider>
    );
    await userEvent.type(screen.getByLabelText("RUN"), "123456789");
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByRole("alert").textContent).toContain("El RUN no es válido");
    expect(registro).not.toHaveBeenCalled();
  });
});
