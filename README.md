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

- **Servidor Web y Proxy Inverso (`Nginx`):** Escucha en el puerto `80`, sirve los archivos estáticos compilados de React (`/var/www/tienda-frontend`) con soporte para rutas SPA (`try_files $uri $uri/ /index.html`) y redirige las peticiones `/api/` hacia el backend en `http://127.0.0.1:8080`.
- **Backend (`Spring Boot` + `systemd`):** Ejecutado como servicio del sistema (`tienda-backend.service`) con arranque automático al iniciar la instancia EC2.
- **Base de Datos (`PostgreSQL 15`):** Migrada desde H2 en memoria hacia **PostgreSQL 15** local (`jdbc:postgresql://localhost:5432/carrito_compras`), garantizando persistencia real de usuarios (con contraseñas cifradas en BCrypt), categorías, productos y órdenes entre reinicios del servidor. Las credenciales se gestionan de forma segura mediante variables de entorno en `systemd` (`DB_PASSWORD`).
- **Documentación y Pruebas API (`Swagger UI` / OpenAPI 3):** Disponible en `http://52.5.171.74:8080/swagger-ui/index.html` (esquema JSON en `/v3/api-docs`). Permite probar el endpoint `POST /api/v1/auth/login`, obtener el token JWT y autorizar peticiones protegidas (`Authorize` con esquema `Bearer`) como `GET /api/v1/usuarios` y `GET /api/v1/ordenes`.

### Verificación de PostgreSQL 15 en la instancia EC2

Comandos para auditar el estado del motor de base de datos, listar las tablas creadas por JPA/Hibernate y comprobar los registros persistidos directamente desde la terminal SSH:

```sh
# 1. Verificar que el servicio PostgreSQL esté activo
sudo systemctl status postgresql

# 2. Listar las tablas creadas en la base de datos carrito_compras
sudo -u postgres psql -d carrito_compras -c "\dt"

# 3. Consultar los usuarios registrados y sus roles
sudo -u postgres psql -d carrito_compras -c "SELECT id, nombre, correo, rol FROM usuarios;"

# 4. Consultar los productos y órdenes almacenadas
sudo -u postgres psql -d carrito_compras -c "SELECT id, nombre, precio, stock FROM productos;"
sudo -u postgres psql -d carrito_compras -c "SELECT id, total, estado, fecha FROM ordenes;"

# 5. Entrar a la consola interactiva de PostgreSQL (salir con \q)
sudo -u postgres psql -d carrito_compras
```
