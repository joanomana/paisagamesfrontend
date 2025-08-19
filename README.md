# 🎮 Paisa Games Frontend

Frontend de la tienda de videojuegos **Paisa Games**, construido con Next.js 15 y React 19. Una plataforma moderna y responsiva para la venta de videojuegos, consolas, accesorios y coleccionables.

## ✨ Características

- 🛒 **Carrito de compras** con persistencia local
- 👨‍💼 **Panel de administración** para gestión de productos y ventas
- 📱 **Diseño responsivo** optimizado para móviles y desktop
- 🎨 **Interfaz moderna** con Tailwind CSS 4
- ⚡ **Rendimiento optimizado** con Next.js y Turbopack
- 🔍 **Filtrado y búsqueda** de productos por categoría
- 🛡️ **Manejo de errores** con notificaciones elegantes

## 🛠️ Tecnologías

- **Framework**: Next.js 15.4.6
- **Frontend**: React 19.1.0
- **Estilos**: Tailwind CSS 4
- **Estado**: Zustand 5.0.7
- **HTTP**: Fetch API personalizada
- **Notificaciones**: SweetAlert2 + Sonner
- **Linting**: ESLint 9

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.jsx         # Layout principal
│   ├── page.jsx           # Página principal (catálogo)
│   ├── administrador/     # Panel de administración
│   ├── carrito/           # Carrito de compras
│   ├── checkout/          # Proceso de pago
│   └── producto/          # Páginas de productos
├── components/            # Componentes reutilizables
│   ├── Navbar.jsx         # Barra de navegación
│   ├── Footer.jsx         # Pie de página
│   ├── Productos.jsx      # Grid de productos
│   ├── CartCont.jsx       # Contenedor del carrito
│   └── admin/             # Componentes del admin
└── lib/                   # Utilidades y APIs
    ├── http.js            # Cliente HTTP personalizado
    └── api/               # Endpoints de la API
└── store/                 # Estado global
    └── cart.js            # Estado del carrito
```

## 🏪 Tipos de Productos

- **🎮 Juegos Físicos**: Copias físicas de videojuegos
- **🔑 Llaves Digitales**: Códigos de activación digital
- **🕹️ Consolas**: PlayStation, Xbox, Nintendo, PC
- **🎧 Accesorios**: Controles, auriculares, almacenamiento
- **🧸 Coleccionables**: Figuras, Amiibo, ediciones especiales

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/joanomana/paisagamesfrontend.git
cd paisagamesfrontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Iniciar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 🔧 Backend

Este frontend se conecta a una API REST que maneja:

- **Productos**: CRUD completo de productos con categorización
- **Carrito**: Gestión de items en el carrito de compras
- **Ventas**: Registro y seguimiento de transacciones
- **Administración**: Panel para gestión de inventario

### Endpoints principales:
- `GET /api/productos` - Lista todos los productos
- `GET /api/productos/:id` - Obtiene un producto específico
- `POST /api/productos` - Crea un nuevo producto (admin)
- `PUT /api/productos/:id` - Actualiza un producto (admin)
- `DELETE /api/productos/:id` - Elimina un producto (admin)
- `GET /api/ventas` - Lista de ventas (admin)
- `POST /api/ventas` - Registra una nueva venta

## 🎨 Diseño

- **Tema**: Oscuro con acentos en blanco y azul
- **Paleta**: `#0b1220` (fondo), `white/10` (elementos), `white` (texto)
- **Tipografía**: System fonts optimizadas
- **Componentes**: Diseño modular y reutilizable

## 🛒 Funcionalidades del Carrito

- Agregar/quitar productos
- Persistencia en localStorage
- Cálculo automático de totales
- Validación de stock
- Proceso de checkout integrado

## 👨‍💼 Panel de Administración

- Dashboard de ventas y estadísticas
- CRUD completo de productos
- Gestión de imágenes (URLs)
- Validación de formularios
- Confirmaciones de acciones

## 🌐 Navegación

- **Inicio**: Catálogo principal con filtros
- **Productos**: Vista detallada individual
- **Carrito**: Gestión de compras
- **Checkout**: Proceso de pago
- **Admin**: Panel de administración

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a Paisa Games.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

⚡ **Optimizado para rendimiento y experiencia de usuario**
🎮 **Hecho con ❤️ para gamers**
