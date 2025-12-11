# Sistema de Ventas - Inventario Eventos

Sistema de gestión de inventario y ventas para eventos, con soporte para pagos en efectivo y Yape.

## Características

- ✅ Gestión de inventario de productos
- ✅ Registro de ventas con múltiples métodos de pago (Efectivo y Yape)
- ✅ Número de Yape configurado (943177720)
- ✅ Captura y almacenamiento de evidencia fotográfica de pagos Yape
- ✅ Edición de ventas procesadas
- ✅ Reportes de cierre de caja
- ✅ Almacenamiento local con localStorage

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (iconos)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build
```

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. La configuración en `vercel.json` ya está lista
4. El despliegue se realizará automáticamente en cada push a la rama `main`

### Configuración de Vercel

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Uso

1. **Inventario**: Agrega y gestiona productos con precio y stock
2. **Vender**: Realiza ventas seleccionando productos y método de pago
   - **Efectivo**: Ingresa el monto recibido (opcional)
   - **Yape**: Muestra el número 943177720 y permite tomar/subir foto como evidencia
3. **Ventas**: Visualiza y edita todas las ventas procesadas
4. **Reporte**: Genera reporte de cierre de caja con resumen de ventas

## Estructura del Proyecto

```
src/
├── pages/
│   ├── Home.tsx          # Página principal
│   ├── Inventory.tsx     # Gestión de inventario
│   ├── Sale.tsx          # Proceso de venta
│   ├── Sales.tsx         # Lista y edición de ventas
│   ├── Settings.tsx      # Configuración
│   └── Report.tsx        # Reportes
├── context/
│   └── StoreContext.tsx  # Estado global
└── types/
    └── types.ts          # Tipos TypeScript
```

## Notas

- Los datos se almacenan en localStorage del navegador
- Las fotos de evidencia se guardan como base64
- El número de Yape está configurado como constante: 943177720



