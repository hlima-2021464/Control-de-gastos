# Control de Gastos

Aplicación fullstack para el control de gastos personales.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js · TypeScript · Express · PostgreSQL · JWT |
| Frontend | Angular 17+ (Standalone Components) |
| Package manager | pnpm |

## Estructura del Proyecto

```
Control-de-gastos/
├── backend/          # API REST con Node.js + TypeScript
│   ├── src/
│   │   ├── config/       # Variables de entorno tipadas
│   │   ├── db/           # Pool de PostgreSQL y schema
│   │   ├── middlewares/  # Error handler global
│   │   ├── modules/
│   │   │   ├── auth/     # Login: servicio, controlador, rutas
│   │   │   └── users/    # Modelos y repositorio de usuarios
│   │   └── utils/        # JWT helpers
│   └── scripts/          # CLI seed de usuarios
└── frontend/         # SPA Angular con Standalone Components
    └── src/
        └── app/
            ├── core/         # Modelos y servicios globales
            └── features/
                └── login/    # Componente de login
```

## Inicio Rápido

### Prerrequisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env        # Configura tus variables
pnpm install
pnpm run dev                # Inicia en modo desarrollo
```

### Base de datos

Ejecuta el schema en tu instancia de PostgreSQL:

```bash
psql -U <usuario> -d <base_de_datos> -f src/db/schema.sql
```

Luego crea un usuario con el script seed:

```bash
pnpm run seed:user
# o con argumentos:
pnpm run seed:user -- --username admin --email admin@example.com --password secret --role ADMIN
```

### Frontend

```bash
cd frontend
pnpm install
pnpm start                  # Sirve en http://localhost:4200
```

## Incrementos

- **Incremento 1** — Login (autenticación JWT) ✅
