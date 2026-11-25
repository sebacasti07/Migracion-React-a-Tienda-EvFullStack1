```markdown
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

### Pruebas con Jasmine + Karma

Las pruebas unitarias que pide la pauta (Jasmine y Karma) están en `src/specs/*.spec.js`
y corren en un navegador real sin ventana (Chrome, o Edge si no hay Chrome instalado):

```sh
npm run test:karma
```

Están separadas según la propuesta de pruebas: `renderizado`, `props`, `estado`,
`eventos`, `mocks-api` (servicios simulados con `spyOn` de Jasmine) y `utilidades`.
Al terminar se genera el reporte de cobertura en `coverage/karma/html/index.html`.
La configuración está en `karma.conf.cjs` (esbuild compila el JSX y un plugin de
Istanbul instrumenta el código de `src` para medir la cobertura).

## Integración con el backend (Evaluación 3)

El frontend consume la API REST del proyecto **tienda-backend** (Spring Boot + JWT),
disponible en https://github.com/Test-debug10/tienda-backend.
Hay tres formas de ejecutarlo:

| Modo / Comando | URL Base / API | Cuándo |
|---|---|---|
| Producción AWS EC2 (`Nginx`) | `http://52.5.171.74` (API en `/api/v1`) | Despliegue productivo: frontend compilado (`dist/`) servido por Nginx y enrutado al backend en puerto `8080` |
| `npm run dev:ec2` | `http://52.5.171.74:8080/api/v1` | Desarrollo local apuntando al backend en AWS EC2 (IP elástica) |
| `npm run dev` | `http://localhost:8080/api/v1` | Desarrollo 100% local: requiere levantar el backend con `./mvnw spring-boot:run` |

La URL del modo EC2 local está en el archivo `.env.ec2`. Para el build de producción
servido tras Nginx se utiliza ruta relativa (`VITE_API_URL=/api/v1`).

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
- `src/context/AuthContext.jsx`: guarda la sesión (`sesionTienda`: token, refresh token y usuario) en `localStorage`,
  así sobrevive a recargas. Al iniciar, confirma la sesión con `GET /auth/me`, cierra sola cuando vence el
  refresh token y se sincroniza entre pestañas.
- `src/components/RutaProtegida.jsx` y `src/utils/permisos.js`: restringen rutas, pestañas y botones según el rol.
  Es solo la capa visual: el backend vuelve a validar el rol en cada petición.
- Flujo de compra: carrito → `/checkout` → `POST /ordenes` → `/compra-exitosa/:id` o `/compra-fallida`.

Blogs y textos de "Nosotros" y "Contacto" siguen guardándose en el navegador.

## Despliegue en Producción (AWS EC2)

La aplicación completa se encuentra desplegada en una instancia **AWS EC2 (Amazon Linux 2023)** con IP elástica `52.5.171.74`:

- **Servidor Web y Proxy Inverso (`Nginx`):** Escucha en el puerto `80`, sirve los archivos estáticos compilados de React (`/var/www/tienda-frontend`) con soporte para rutas SPA (`try_files $uri$uri/ /index.html`) y redirige las peticiones `/api/` hacia el backend en `http://127.0.0.1:8080`.
- **Backend (`Spring Boot` + `systemd`):** Ejecutado como servicio del sistema (`tienda-backend.service`) con arranque automático al iniciar la instancia EC2. Documentación interactiva disponible en `/swagger-ui/index.html`.
- **Base de Datos (`PostgreSQL 15`):** Persistencia relacional local (`carrito_compras`) con credenciales inyectadas mediante variables de entorno en el servicio `systemd` (`DB_PASSWORD`).

```
