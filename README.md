# Sistema de Gestión de Afiliados - Clínica Dental

Proyecto desarrollado con Node.js, Express, TypeScript, Prisma y Handlebars utilizando arquitectura MVC.

El sistema permite administrar pacientes afiliados de una clínica dental y simular descuentos según el tipo de afiliación.

---

# Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Handlebars

---

# Arquitectura MVC

El proyecto está organizado utilizando el patrón MVC:

```txt
src/
│
├── controllers/
├── routes/
├── services/
├── views/
│   ├── affiliates/
│   └── layouts/
│
├── app.ts
└── index.ts
```

- Model: Prisma + Base de datos
- View: Handlebars (.hbs)
- Controller: Lógica de negocio
- Router: Definición de rutas

---

# Funcionalidades

## CRUD completo de afiliados

- Listar afiliados
- Ver detalle de afiliado
- Crear afiliado
- Editar afiliado
- Eliminar afiliado

## Simulación de descuentos

Cada afiliado posee un tipo de membresía:

| Membresía | Descuento |
|----------|-----------|
| Silver | 5% |
| Gold | 10% |
| Platinum | 20% |

En la vista de detalle se puede ingresar un monto de tratamiento para calcular el descuento aplicado y el precio final.

---

# Instalación

## 1. Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

---

## 2. Entrar al proyecto

```bash
cd clinica-dental
```

---

## 3. Instalar dependencias

```bash
npm install
```

---

## 4. Configurar variables de entorno

Crear archivo `.env`

```env
DATABASE_URL="file:./dev.db"
```

---

## 5. Generar Prisma Client

```bash
npx prisma generate
```

---

## 6. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

---

# Ejecutar proyecto

Modo desarrollo:

```bash
npm run dev
```

Servidor disponible en:

```txt
http://localhost:3000
```

---

# Scripts

```json
"scripts": {
  "dev": "tsx watch src/index.ts"
}
```

---

# Rutas principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | / | Inicio |
| GET | /affiliates | Listar afiliados |
| GET | /affiliates/create | Formulario creación |
| POST | /affiliates/create | Crear afiliado |
| GET | /affiliates/:id | Ver afiliado |
| GET | /affiliates/edit/:id | Formulario edición |
| POST | /affiliates/update/:id | Actualizar afiliado |
| POST | /affiliates/delete/:id | Eliminar afiliado |
| POST | /affiliates/simulate/:id | Simular descuento |

---

# Base de datos

Modelo Prisma:

```prisma
model Affiliate {

  id Int @id @default(autoincrement())

  firstName String

  lastName String

  email String @unique

  membershipType MembershipType
}
```

---