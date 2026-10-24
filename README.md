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

## Administrador y almacenamiento

El acceso inicial de administrador es usuario `Admin` y contraseña
`Admin1234@`; ya no se solicita configurar la contraseña al abrir el inicio de
sesión. Los usuarios registrados pueden cambiar su contraseña desde el menú de
cuenta, y el administrador puede cambiarla desde la sección **Usuarios** del
panel. Las cuentas se guardan en `localStorage` y solo existen en ese navegador.

Este proyecto es una demostración frontend: no tiene backend, las contraseñas
no están protegidas por un servidor y el estado de sesión del navegador no
constituye una barrera de seguridad. No usar con datos reales ni desplegar como
sistema administrativo de producción. Cambia la contraseña predeterminada si
usas esta demostración en un entorno compartido.
