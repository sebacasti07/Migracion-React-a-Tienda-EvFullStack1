import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { productosDePrueba, sesionDePrueba } from "./ayudantes.jsx";
import Login from "../pages/login";
import Ofertas from "../pages/Ofertas";
import Checkout from "../pages/Checkout";
import RutaProtegida from "../components/RutaProtegida";
import { AuthProvider } from "../context/AuthContext";
import { authApi, ordenesApi, productosApi } from "../api/servicios";
import { guardarSesion, leerSesion } from "../utils/sesion";

// USO DE MOCKS
// Con spyOn de Jasmine reemplazamos las llamadas a la API por respuestas falsas.
// Así probamos la integración del componente con el servicio sin necesitar el backend.

function conRutas(inicial, elemento, extra = []) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[inicial]}>
        <Routes>
          <Route path={inicial} element={elemento} />
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/admin" element={<h1>Panel</h1>} />
          <Route path="/acceso-denegado" element={<h1>Acceso denegado</h1>} />
          {extra}
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("Login con la API simulada", () => {
  beforeEach(() => localStorage.clear());

  it("Con credenciales válidas guarda la sesión y redirige al panel si es VENDEDOR", async () => {
    const login = spyOn(authApi, "login").and.resolveTo(sesionDePrueba("VENDEDOR"));
    conRutas("/ingresar", <Login />);

    await userEvent.type(screen.getByLabelText("Correo"), "vendedor@duoc.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "Vendedor123@");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("heading", { name: "Panel" })).toBeTruthy();
    expect(login).toHaveBeenCalledOnceWith("vendedor@duoc.cl", "Vendedor123@");
    expect(leerSesion().usuario.rol).toBe("VENDEDOR");
  });

  it("Si la API responde 401 muestra el mensaje de error y no guarda sesión", async () => {
    spyOn(authApi, "login").and.rejectWith({ response: { status: 401, data: { error: "Correo o contraseña incorrectos" } } });
    conRutas("/ingresar", <Login />);

    expect(screen.queryByRole("alert")).toBeNull();
    await userEvent.type(screen.getByLabelText("Correo"), "x@gmail.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "mala");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Correo o contraseña incorrectos");
    expect(leerSesion()).toBeNull();
  });
});

describe("Rutas protegidas con sesión simulada", () => {
  beforeEach(() => localStorage.clear());

  it("Un CLIENTE que entra a una ruta de ADMIN/VENDEDOR ve acceso denegado", async () => {
    const sesion = sesionDePrueba("CLIENTE");
    guardarSesion(sesion);
    spyOn(authApi, "perfil").and.resolveTo(sesion.usuario);

    conRutas("/privado", <RutaProtegida roles={["ADMIN", "VENDEDOR"]}><h1>Secreto</h1></RutaProtegida>);

    expect(await screen.findByRole("heading", { name: "Acceso denegado" })).toBeTruthy();
    expect(screen.queryByText("Secreto")).toBeNull();
  });

  it("Sin sesión redirige al login", () => {
    conRutas("/privado", <RutaProtegida><h1>Secreto</h1></RutaProtegida>);
    expect(screen.getByRole("heading", { name: "Login" })).toBeTruthy();
  });
});

describe("Ofertas con productosApi simulado", () => {
  it("Muestra los productos que devuelve la API", async () => {
    spyOn(productosApi, "ofertas").and.resolveTo([productosDePrueba[0]]);
    conRutas("/ofertas", <Ofertas agregarAlCarrito={() => {}} />);
    expect(await screen.findByText("Teclado Mecánico RGB")).toBeTruthy();
  });

  it("Si la API falla muestra un mensaje de error", async () => {
    spyOn(productosApi, "ofertas").and.rejectWith({ response: { status: 500, data: { error: "Error interno" } } });
    conRutas("/ofertas", <Ofertas agregarAlCarrito={() => {}} />);
    expect((await screen.findByRole("alert")).textContent).toContain("Error interno");
  });
});

describe("Checkout con ordenesApi simulado", () => {
  const carrito = [{ ...productosDePrueba[0], cantidad: 2 }];
  const extra = [
    <Route key="ok" path="/compra-exitosa/:id" element={<h1>Compra exitosa</h1>} />,
    <Route key="mal" path="/compra-fallida" element={<h1>Compra fallida</h1>} />
  ];

  beforeEach(() => {
    localStorage.clear();
    const sesion = sesionDePrueba("CLIENTE");
    sesion.usuario = { ...sesion.usuario, direccion: "Calle 1", region: "Metropolitana de Santiago", comuna: "Santiago" };
    guardarSesion(sesion);
    spyOn(authApi, "perfil").and.resolveTo(sesion.usuario);
  });

  it("Envía solo id y cantidad, vacía el carrito y va a compra exitosa", async () => {
    const crear = spyOn(ordenesApi, "crear").and.resolveTo({ id: 15, detalles: [] });
    const vaciar = jasmine.createSpy("vaciarCarrito");
    conRutas("/checkout", <Checkout carrito={carrito} vaciarCarrito={vaciar} />, extra);

    await userEvent.click(await screen.findByRole("button", { name: /Pagar ahora/ }));

    expect(await screen.findByRole("heading", { name: "Compra exitosa" })).toBeTruthy();
    expect(crear.calls.mostRecent().args[0].items).toEqual([{ productoId: 1, cantidad: 2 }]);
    expect(vaciar).toHaveBeenCalled();
  });

  it("Si la API responde 409 va a compra fallida y no vacía el carrito", async () => {
    spyOn(ordenesApi, "crear").and.rejectWith({ response: { status: 409, data: { error: "Stock insuficiente" } } });
    const vaciar = jasmine.createSpy("vaciarCarrito");
    conRutas("/checkout", <Checkout carrito={carrito} vaciarCarrito={vaciar} />, extra);

    await userEvent.click(await screen.findByRole("button", { name: /Pagar ahora/ }));

    expect(await screen.findByRole("heading", { name: "Compra fallida" })).toBeTruthy();
    expect(vaciar).not.toHaveBeenCalled();
  });
});
