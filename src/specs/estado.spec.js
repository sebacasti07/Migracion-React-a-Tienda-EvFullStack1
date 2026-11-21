import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "./ayudantes.jsx";
import FormularioContacto from "../components/FormularioContacto";
import CampoContraseña from "../components/CampoContraseña";
import CrearUsuario from "../pages/CrearUsuario";
import { AuthProvider } from "../context/AuthContext";

// PRUEBAS DE ESTADO (state)
// Comprueban que el estado interno de los componentes cambia como se espera.

describe("Gestión del estado", () => {
  beforeEach(() => localStorage.clear());

  it("El estado del formulario de contacto cambia al escribir", async () => {
    render(<FormularioContacto />);
    const nombre = screen.getByLabelText("Nombre");
    const mensaje = screen.getByLabelText("Mensaje");

    await userEvent.type(nombre, "Matías");
    await userEvent.type(mensaje, "Hola");

    expect(nombre.value).toBe("Matías");
    expect(mensaje.value).toBe("Hola");
    expect(screen.getByText("4/500 caracteres")).toBeTruthy();
  });

  it("CampoContraseña alterna entre ocultar y mostrar la contraseña", async () => {
    let valor = "";
    render(<CampoContraseña id="clave" value={valor} onChange={(e) => (valor = e.target.value)} />);
    const campo = document.getElementById("clave");
    expect(campo.type).toBe("password");

    await userEvent.click(screen.getByRole("button", { name: /mostrar/i }));
    expect(campo.type).toBe("text");

    await userEvent.click(screen.getByRole("button", { name: /ocultar/i }));
    expect(campo.type).toBe("password");
  });

  it("En el registro, al elegir una región se cargan sus comunas y al cambiarla se borra la comuna", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <CrearUsuario />
        </MemoryRouter>
      </AuthProvider>
    );
    const region = screen.getByLabelText("Región");
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna.disabled).toBeTrue();

    await userEvent.selectOptions(region, "Valparaíso");
    expect(comuna.disabled).toBeFalse();
    await userEvent.selectOptions(comuna, "Viña del Mar");
    expect(comuna.value).toBe("Viña del Mar");

    await userEvent.selectOptions(region, "Biobío");
    expect(comuna.value).toBe("");
  });
});
