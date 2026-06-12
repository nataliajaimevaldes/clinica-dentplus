# Clínica Dental - Sistema de Gestión de Afiliados

Sistema de gestión de afiliados para clínica dental desarrollado con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## Inicio Rápido

### Con Docker (Recomendado)
```bash
docker-compose up -d
docker exec clinica-dentplus npx prisma migrate deploy
npm run dev  # o visitá http://localhost:3000
```

### Desarrollo Local
```bash
npm install
docker-compose up db -d
npx prisma migrate deploy
npm run dev
```

## Tecnologías
- **Backend**: Node.js, Express, TypeScript
- **BD**: PostgreSQL, Prisma ORM
- **Frontend**: Handlebars (SSR)
- **Seguridad**: bcryptjs, express-session, Zod
- **DevOps**: Docker, Docker Compose
-  **Refactoring seguro**: Los tipos evitan breaking changes silenciosos

### Prisma vs SQL puro
-  **Type-safe queries**: Los tipos se generan automáticamente del schema
-  **Migraciones automáticas**: Versionamiento de cambios en BD
-  **Menos vulnerabilidades**: Previene SQL injection nativamente
-  **DX mejorado**: Query builder más intuitivo que escribir SQL

### Handlebars vs SPA Framework (React/Vue)
-  **Simplicidad**: Ideal para proyectos medianos sin requisitos complejos
-  **Performance**: SSR nativo, SEO optimizado, menos JavaScript en cliente
-  **Curva de aprendizaje**: Plantillas simples, lógica en el backend
-  **Bundle size**: La app es más ligera (sin 200kb de React)

### Zod vs Validación manual
-  **Type inference**: Genera tipos TypeScript automáticamente del schema
-  **Reutilización**: Un schema se usa para backend y generación de tipos
-  **Error messages claros**: Mensajes de validación estructurados
-  **Menos código boilerplate**: No necesitas escribir validadores manuales
- ✅**Transformaciones**: Modificar datos durante validación (ej: trim(), toLowerCase())

**Ejemplo con Zod vs manual:**

```typescript
// ❌ Manual (tedioso y propenso a errores)
function validateUser(data: unknown) {
  if (typeof data !== 'object') throw new Error('Invalid');
  if (typeof data.email !== 'string') throw new Error('Email must be string');
  if (!data.email.includes('@')) throw new Error('Invalid email');
  // ... más validaciones...
}

// ✅ Con Zod (declarativo y type-safe)
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type User = z.infer<typeof userSchema>; // Tipo generado automáticamente
```

### Docker Compose vs PostgreSQL local
-  **Ambiente consistente**: Todos los desarrolladores usan la misma BD
-  **Isolamiento**: No interfiere con otras aplicaciones en tu máquina
-  **Fácil reseteo**: Eliminar volumen limpia la BD completamente
-  **Ready para producción**: El mismo compose se usa en staging/prod

---

## Estructura de Carpetas

La arquitectura MVC organiza el código por responsabilidad:

```txt
src/
├── controllers/
│   ├── auth.controller.ts          # Lógica de autenticación (login, register)
│   └── affiliateController.ts      # CRUD de afiliados (create, read, update, delete)
│
├── models/
│   ├── user.model.ts               # Operaciones DB para usuarios (queries Prisma)
│   └── affiliate.model.ts          # Operaciones DB para afiliados
│
├── routes/
│   ├── authRoutes.ts               # Mapeo de rutas auth (/login, /register)
│   └── affiliateRoutes.ts          # Mapeo de rutas affiliates (/affiliates/*, etc)
│
├── schemas/
│   ├── auth.schemas.ts             # Validaciones Zod para login/register
│   └── affiliate.schemas.ts        # Validaciones Zod para afiliados
│
├── middleware/
│   └── authMiddleware.ts           # Verificar autenticación en rutas protegidas
│
├── lib/
│   ├── prisma.ts                   # Cliente singleton de Prisma
│   └── parseError.ts               # Formatear errores para respuestas
│
├── views/
│   ├── auth/
│   │   ├── login.hbs               # Formulario de login
│   │   └── register.hbs            # Formulario de registro
│   ├── affiliates/
│   │   ├── index.hbs               # Listado de afiliados
│   │   ├── create.hbs              # Formulario crear afiliado
│   │   ├── edit.hbs                # Formulario editar afiliado
│   │   └── detail.hbs              # Detalle de un afiliado
│   ├── layouts/
│   │   └── main.hbs                # Layout base (navbar, estructura)
│   ├── 404.hbs                     # Página no encontrada
│   └── home.hbs                    # Homepage
│
├── app.ts                          # Configuración de Express, middlewares globales
└── index.ts                        # Punto de entrada (inicia servidor)
```

### ¿Por qué esta estructura?

| Carpeta | Propósito | Beneficio |
|---------|-----------|----------|
| `controllers/` | Lógica de request/response | Fácil testear, responsabilidad clara |
| `models/` | Lógica de base de datos | Reutilizable, queries centralizadas |
| `routes/` | Mapeo de URLs | Fácil ver todas las rutas en un lugar |
| `schemas/` | Validaciones | Compartible entre controllers y tipos TS |
| `middleware/` | Lógica transversal | Auth, logging, CORS, etc. |
| `views/` | HTML templates | Renderizado server-side |
| `lib/` | Utilidades globales | Funciones reutilizables |

---

## Docker Compose - Servicios

### Servicio: `db` (PostgreSQL)

```yaml
db:
  image: postgres:16-alpine        # Imagen oficial de PostgreSQL versión 16 (lightweight)
  container_name: clinica-dentplus-db
  restart: unless-stopped          # Reinicia si falla, excepto si lo detuviste manualmente
  
  environment:                      # Variables de configuración BD
    POSTGRES_USER: postgres         # Usuario administrador
    POSTGRES_PASSWORD: postgres     # Contraseña (¡cambiar en producción!)
    POSTGRES_DB: clinica_dentplus  # Nombre de la BD
  
  ports:
    - "5432:5432"                  # Puerto local:puerto contenedor
                                    # Permite conectarse desde el host en localhost:5432
  
  volumes:
    - postgres_data:/var/lib/postgresql/data  # Persistencia de datos
                                    # Volumen named: datos sobreviven container restarts
  
  healthcheck:                      # Verifica que la BD esté lista
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 5s                    # Chequear cada 5 segundos
    timeout: 5s                     # Esperar máximo 5s por respuesta
    retries: 5                      # Reintentar 5 veces
  
  networks:
    - clinica-network              # Red Docker para comunicación con otros servicios
```

### ¿Qué hace cada parte?

- **image:postgres:16-alpine** → Descarga PostgreSQL versión 16, imagen pequeña (70MB vs 300MB normal)
- **POSTGRES_PASSWORD** → Credenciales para acceder a la BD
- **ports** → Expone puerto 5432 del contenedor al host (tu máquina local)
- **volumes** → Guarda datos en disco persistente (datos no se pierden al detener)
- **healthcheck** → Docker espera a que la BD esté lista antes de iniciar app
- **networks** → Aislamiento: solo servicios en esta red pueden conectarse

### Red Bridge (`clinica-network`)

La red bridge permite que los contenedores se comuniquen entre sí por nombre:
```
app → conecta a "db" → Docker resuelve a IP interna del contenedor
```

---

## Características

### Autenticación y Autorización
-  Registro e inicio de sesión de usuarios
-  Contraseñas hasheadas con bcryptjs (con salt rounds)
-  Sesiones seguras con express-session
-  Protección de rutas - solo usuarios autenticados pueden acceder a afiliados
-  Aislamiento de datos - cada usuario solo ve sus propios afiliados
-  Logout seguro con destrucción de sesión

### Validaciones
-  Validaciones con Zod en todos los formularios
-  Mensajes de error inline junto a los campos
-  Repoblación de formularios en caso de error
-  Validaciones tanto en frontend como backend (nunca confíes solo en cliente)

### CRUD de Afiliados
-  Listar afiliados del usuario autenticado
-  Ver detalle de afiliado
-  Crear afiliado
-  Editar afiliado con validación
-  Eliminar afiliado

### Simulador de Descuentos
-  Calcular descuento según tipo de membresía
-  Mostrar precio final después de descuento

| Membresía | Descuento |
|----------|-----------|
| Silver | 5% |
| Gold | 10% |
| Platinum | 20% |

---

## Comandos útiles

```bash
# Compilar TypeScript a JavaScript
npm run build

# Ver la carpeta dist/ generada
ls dist/

# Desarrollar con hot-reload
npm run dev

# Ejecutar en producción (desde dist/)
npm start

# Migraciones
npx prisma migrate dev --name <nombre>  # Crear migración
npx prisma migrate deploy               # Ejecutar migraciones
npx prisma studio                       # Abrir GUI de Prisma

# Logs del contenedor
docker-compose logs -f db

# Conectarse a PostgreSQL desde terminal
docker-compose exec db psql -U postgres -d clinica_dentplus
```

---

## Variables de Entorno

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clinica_dentplus"
NODE_ENV="development"
```

Para producción cambiar:
- `postgres:postgres` → credenciales seguras
- `localhost` → hostname del servidor BD
- `NODE_ENV="production"`

---

## Estructura de Compilación

```
src/ (TypeScript) → npm run build → dist/ (JavaScript)
                   ↓
              Ejecuta en producción
              (node dist/index.js)
```

**dist/** NO se versiona (está en .gitignore). Se regenera con cada build.
- **Router**: Rutas con middleware de protección

---

# Instalación

## Requisitos previos
- Node.js 18+
- Docker y Docker Compose
- npm o yarn

## 1. Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd clinica-dentplus
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` debe contener:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clinica_dentplus"

# Secreto para sesiones (cambiar en producción)
SESSION_SECRET="desarrollo-secret-cambiar-en-produccion"
```

## 4. Iniciar base de datos con Docker Compose

```bash
docker-compose up -d
```

Esto inicia una instancia de PostgreSQL 16 Alpine en el puerto 5432.

Verificar que el contenedor está ejecutándose:

```bash
docker-compose ps
```

## 5. Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

# Ejecutar proyecto

## Modo desarrollo

```bash
npm run dev
```

Servidor disponible en: `http://localhost:3000`

## Compilar a producción

```bash
npm run build
```

## Ejecutar en producción

```bash
npm start
```

---

# Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

# Rutas de Autenticación

| Método | Ruta | Descripción | Protegida |
|--------|------|-------------|-----------|
| GET | /auth/register | Formulario de registro | No |
| POST | /auth/register | Crear cuenta | No |
| GET | /auth/login | Formulario de login | No |
| POST | /auth/login | Iniciar sesión | No |
| GET | /auth/logout | Cerrar sesión | Sí |

---

# Rutas de Afiliados

Todas las rutas de afiliados están **protegidas** - requieren estar autenticado.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /affiliates | Listar afiliados del usuario |
| GET | /affiliates/create | Formulario crear afiliado |
| POST | /affiliates/create | Crear afiliado |
| GET | /affiliates/:id | Ver detalle de afiliado |
| GET | /affiliates/edit/:id | Formulario editar afiliado |
| POST | /affiliates/update/:id | Actualizar afiliado |
| POST | /affiliates/delete/:id | Eliminar afiliado |
| POST | /affiliates/simulate/:id | Simular descuento |

---

# Base de datos - Esquema Prisma

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  affiliates Affiliate[]
}

model Affiliate {
  id              Int     @id @default(autoincrement())
  firstName       String
  lastName        String
  email           String
  membershipType  MembershipType
  
  userId          Int
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, email])
}

enum MembershipType {
  silver
  gold
  platinum
}
```

---

# Validaciones

## Login
- Email es requerido y debe ser válido
- Contraseña es requerida (mín. 6 caracteres)

## Registro
- Email es requerido y debe ser válido
- Contraseña es requerida (mín. 6 caracteres, máx. 100)
- Las contraseñas deben coincidir

## Afiliado
- Nombre es requerido (2-100 caracteres)
- Apellido es requerido (2-100 caracteres)
- Email es requerido y debe ser válido
- Tipo de membresía es requerido (silver/gold/platinum)
- Email único por usuario (no puede haber duplicados)

---

# Seguridad

-  Contraseñas hasheadas con bcryptjs (10 rounds)
-  Sesiones con HTTPOnly cookies
-  Protección de rutas con middleware
-  Validación de entrada con Zod
-  Aislamiento de datos por usuario
-  Eliminación en cascada de afiliados al eliminar usuario

---

# Desarrollo

## Comandos útiles

Generar Prisma Client:
```bash
npx prisma generate
```

Abrir Prisma Studio (GUI de base de datos):
```bash
npx prisma studio
```

Ver migraciones:
```bash
npx prisma migrate status
```

Reset de base de datos (advertencia: elimina todos los datos):
```bash
npx prisma migrate reset
```

---

# Estructura de respuestas

Las vistas manejan dos tipos de feedback:

### Errores de validación
```hbs
{{#if errors.fieldName}}
  <div class="invalid-feedback d-block">
    {{errors.fieldName}}
  </div>
{{/if}}
```

### Mensajes de éxito
```hbs
{{#if success}}
  <div class="alert alert-success">
    {{success}}
  </div>
{{/if}}
```

---

# Troubleshooting

## Error: "connect ECONNREFUSED 127.0.0.1:5432"
La base de datos PostgreSQL no está ejecutándose. Ejecutar:
```bash
docker-compose up -d
```

## Error: "UNIQUE constraint failed"
Email del afiliado ya existe para ese usuario. Usar un email diferente.

## Error: "TypeError: Cannot read property 'userId' of undefined"
El usuario no está autenticado. Iniciar sesión primero.

## Limpiar caché de TypeScript
```bash
rm -rf dist/
npm run build
```

---

# Licencia

MIT