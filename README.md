# Sonido Vivo – Grupo 6

Desarrollo Full Stack II (DSY-1104) · Evaluación Parcial 2

## Integrantes
- Sebastian Vallejos (seb.vallejos@duocuc.cl)
- Diego Alvear (die.alvear@duocuc.cl)
- Enzo Arriati (en.arriati@duocuc.cl)

## Caso
Sonido Vivo

## Descripción del caso
Tienda en línea de productos sonoros: micrófonos, parlantes, baterías, guitarras, etc.
La aplicación permite iniciar sesión, explorar el catálogo con filtros, ver el detalle
de cada producto, revisar las ofertas, agregar productos al carrito y confirmar la compra.
El rol administrador gestiona los usuarios y el catálogo.
Los datos son simulados: viven en archivos JavaScript y en `localStorage`.

## Tecnologías
- React + Vite
- React Router
- Bootstrap / React Bootstrap
- Vitest + Testing Library + jsdom (pruebas unitarias)

## Estructura del proyecto
```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
├── services/
├── utils/
└── data/
```
Los componentes siguen Atomic Design. La lógica de negocio está en `services/`
(carrito, pedidos, usuarios) y `utils/` (precios, ofertas, filtros, validaciones).

## Rutas principales
| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/catalogo` | Catálogo con filtros |
| `/producto/:slug` | Detalle de producto |
| `/ofertas` | Productos con descuento |
| `/carrito` | Carrito de compras |
| `/confirmacion` | Confirmación de la compra |
| `/login`, `/register`, `/contact` | Sesión, registro y contacto |
| `/admin` | Administración de usuarios |

## Cómo ejecutar el proyecto
```
npm install
npm run dev
```
## Pruebas unitarias
```
npm run test        # modo vigilancia
npm run test:run    # ejecuta todas las pruebas una vez
npm run test:cov    # pruebas + reporte de cobertura (carpeta coverage/)
```
Para ejecutar solo algunos archivos: `npx vitest run src/utils/ofertas`

La configuración está en el bloque `test` de `vite.config.js` y en `src/setupTests.js`.

## Material complementario
Carpeta de Drive con documentos del semestre (ERS y otros):
https://drive.google.com/drive/folders/1UhBwF-PorXAmK7vDMDS7_EXlZJyVqU1M?usp=sharing