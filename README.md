# Mi Tienda En Linea

Tienda de demostración construida con React y Vite. Incluye catálogo con filtros,
carrito, páginas de productos y blog, registro de usuarios y un panel para
administrar los datos del sitio.

## Desarrollo local

```sh
npm install
npm run dev
```

Validaciones:

```sh
npm run lint
npm run test:run
npm run build
```

Para ejecutar las pruebas en modo watch durante el desarrollo:

```sh
npm test
```

Para ejecutar las pruebas de navegador en Chromium real con Playwright:

```sh
npm run test:browser
```

La suite habitual usa Vitest con jsdom; las pruebas `*.browser.test.jsx` corren
en Chromium. Los matchers de `@testing-library/jest-dom` y la limpieza de React
Testing Library se configuran en `src/test/setup.js`.

## Integración con el backend (Evaluación 3)

El frontend consume la API REST del proyecto **tienda-backend** (Spring Boot + JWT).
Antes de `npm run dev` hay que levantar el backend (`./mvnw spring-boot:run`), que queda en
`http://localhost:8080`. Para usar otra URL se crea un archivo `.env`:

```sh
VITE_API_URL=http://IP_DEL_SERVIDOR:8080/api/v1
```

### Cuentas de prueba

| Rol | Correo | Contraseña | Qué puede hacer |
|---|---|---|---|
| Administrador | admin@duoc.cl | Admin1234@ | Todo: productos, categorías, órdenes, usuarios y contenido |
| Vendedor | vendedor@duoc.cl | Vendedor123@ | Ver productos y órdenes (lista y detalle), sin modificar |
| Cliente | cliente@gmail.com | Cliente123@ | Comprar en la tienda y ver sus compras |

### Cómo está armado

- `src/api/cliente.js`: instancia de **axios**. Un interceptor agrega `Authorization: Bearer <token>`
  a cada petición y, si el backend responde 401, renueva el token con `/auth/refresh` y repite la petición.
- `src/api/servicios.js`: una función por endpoint (`productosApi`, `ordenesApi`, `usuariosApi`, etc.).
- `src/context/AuthContext.jsx`: guarda la sesión (token, refresh token y usuario) en `localStorage`,
  así sobrevive a recargas. Al iniciar, confirma la sesión con `GET /auth/me`, cierra sola cuando vence el
  refresh token y se sincroniza entre pestañas.
- `src/components/RutaProtegida.jsx` y `src/utils/permisos.js`: restringen rutas, pestañas y botones según el rol.
  Es solo la capa visual: el backend vuelve a validar el rol en cada petición.
- Flujo de compra: carrito → `/checkout` → `POST /ordenes` → `/compra-exitosa/:id` o `/compra-fallida`.

Blogs y textos de "Nosotros" y "Contacto" siguen guardándose en el navegador.
