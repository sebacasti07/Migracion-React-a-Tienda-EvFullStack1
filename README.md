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
npm run build
```

## Administrador y almacenamiento

Al abrir **Iniciar sesión** por primera vez en un navegador, se solicita
configurar la contraseña del usuario `admin`. Los cambios y credenciales se
guardan en `localStorage` y solo existen en ese navegador.

Este proyecto es una demostración frontend: no tiene backend, las contraseñas
no están protegidas por un servidor y el estado de sesión del navegador no
constituye una barrera de seguridad. No usar con datos reales ni desplegar como
sistema administrativo de producción.
