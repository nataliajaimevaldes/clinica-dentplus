# Sistema de Gestión de Afiliados - Clínica Dental

Proyecto desarrollado con Node.js, Express, TypeScript, Prisma y Handlebars utilizando arquitectura MVC.

El sistema permite a usuarios registrados administrar pacientes afiliados de una clínica dental y simular descuentos según el tipo de afiliación. Incluye autenticación segura con sesiones y contraseñas hasheadas con bcryptjs.

---

# Tecnologías utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Lenguaje tipado
- **Prisma ORM** - Gestor de base de datos
- **PostgreSQL** - Base de datos relacional
- **Handlebars** - Template engine
- **Zod** - Validación de esquemas
- **bcryptjs** - Hasheado de contraseñas
- **Docker Compose** - Orquestación de contenedores

---

# Características

## Autenticación y Autorización
- ✅ Registro e inicio de sesión de usuarios
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Sesiones seguras con express-session
- ✅ Protección de rutas - solo usuarios autenticados pueden acceder a afiliados
- ✅ Aislamiento de datos - cada usuario solo ve sus propios afiliados
- ✅ Logout seguro con destrucción de sesión

## Validaciones
- ✅ Validaciones con Zod en todos los formularios
- ✅ Mensajes de error inline junto a los campos
- ✅ Repoblación de formularios en caso de error
- ✅ Validaciones tanto en frontend como backend

## CRUD de Afiliados
- ✅ Listar afiliados del usuario autenticado
- ✅ Ver detalle de afiliado
- ✅ Crear afiliado
- ✅ Editar afiliado con validación
- ✅ Eliminar afiliado

## Simulador de Descuentos
- ✅ Calcular descuento según tipo de membresía
- ✅ Mostrar precio final después de descuento

| Membresía | Descuento |
|----------|-----------|
| Silver | 5% |
| Gold | 10% |
| Platinum | 20% |

---

# Arquitectura MVC

El proyecto está organizado utilizando el patrón MVC:

```txt
src/
├── controllers/
│   ├── auth.controller.ts          # Lógica de autenticación
│   └── affiliateController.ts      # CRUD de afiliados
├── models/
│   ├── user.model.ts               # Operaciones de usuario
│   └── affiliate.model.ts           # Operaciones de afiliado
├── routes/
│   ├── authRoutes.ts               # Rutas de autenticación
│   └── affiliateRoutes.ts          # Rutas de afiliados
├── schemas/
│   ├── auth.schemas.ts             # Validaciones con Zod
│   └── affiliate.schemas.ts        # Validaciones de afiliado
├── middleware/
│   └── authMiddleware.ts           # Protección de rutas
├── lib/
│   ├── prisma.ts                   # Cliente de Prisma
│   └── parseError.ts               # Formateo de errores
├── views/
│   ├── auth/
│   │   ├── login.hbs
│   │   └── register.hbs
│   ├── affiliates/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   ├── edit.hbs
│   │   └── detail.hbs
│   ├── layouts/
│   │   └── main.hbs
│   ├── 404.hbs
│   └── home.hbs
├── app.ts                          # Configuración de Express
└── index.ts                        # Punto de entrada
```

- **Model**: Prisma ORM + PostgreSQL
- **View**: Handlebars (.hbs)
- **Controller**: Lógica de negocio con validaciones
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

- ✅ Contraseñas hasheadas con bcryptjs (10 rounds)
- ✅ Sesiones con HTTPOnly cookies
- ✅ Protección de rutas con middleware
- ✅ Validación de entrada con Zod
- ✅ Aislamiento de datos por usuario
- ✅ Eliminación en cascada de afiliados al eliminar usuario

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