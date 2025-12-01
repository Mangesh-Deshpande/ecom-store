# Monorepo

A modern, full-stack TypeScript monorepo featuring a React frontend and Express.js backend, orchestrated with Turborepo for optimal development experience.

## 🚀 Features

- **Monorepo Architecture** - Efficiently managed with Turborepo and npm workspaces
- **Full TypeScript Support** - End-to-end type safety across frontend and backend
- **Modern Frontend** - React 18+ with Vite for lightning-fast HMR
- **Robust Backend** - Express.js with comprehensive API structure
- **API Documentation** - Auto-generated OpenAPI/Swagger documentation
- **Testing Ready** - Vitest configured for both frontend and backend
- **Code Documentation** - TypeDoc integration for generating technical docs
- **Developer Experience** - Hot reload, path aliases, and optimized builds

## 📁 Project Structure

```
monorepo-boilerplate/
├── apps/
│   ├── frontend/          # React + Vite application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── backend/           # Express.js API server
│       ├── src/
│       │   ├── controllers/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middlewares/
│       │   ├── models/
│       │   └── utils/
│       └── package.json
│
├── packages/              # Shared packages (optional)
│   └── shared/
│
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json
└── tsconfig.json         # Root TypeScript config
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Testing**: Vitest + React Testing Library
- **Documentation**: TypeDoc

### Backend

- **Framework**: Express.js
- **Language**: TypeScript 5
- **Runtime**: Node.js
- **API Docs**: Swagger/OpenAPI
- **Testing**: Vitest + Supertest
- **Documentation**: TypeDoc

### DevOps

- **Monorepo Tool**: Turborepo
- **Package Manager**: npm workspaces
- **Process Manager**: tsx (for development)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd monorepo-boilerplate
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

**Backend (.env)**

```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=4000
NODE_ENV=development
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Run individual applications:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Access the Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/api/health

## 📦 Available Scripts

### Root Level

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start all apps in development mode |
| `npm run build`        | Build all apps for production      |
| `npm run test`         | Run tests across all apps          |
| `npm run lint`         | Lint all apps                      |
| `npm run dev:frontend` | Run only frontend                  |
| `npm run dev:backend`  | Run only backend                   |

### Frontend (apps/frontend)

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start Vite dev server          |
| `npm run build`         | Build for production           |
| `npm run preview`       | Preview production build       |
| `npm run test`          | Run unit tests                 |
| `npm run test:ui`       | Run tests with UI              |
| `npm run test:coverage` | Generate coverage report       |
| `npm run docs`          | Generate TypeDoc documentation |

### Backend (apps/backend)

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Compile TypeScript to JavaScript         |
| `npm run start`         | Start production server                  |
| `npm run test`          | Run unit and integration tests           |
| `npm run test:coverage` | Generate coverage report                 |
| `npm run docs`          | Generate TypeDoc documentation           |

## 🧪 Testing

Run tests for all packages:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
# Frontend
cd apps/frontend
npm run test -- --watch

# Backend
cd apps/backend
npm run test -- --watch
```

## 📖 API Documentation

The backend includes auto-generated OpenAPI documentation using Swagger.

Access the interactive API docs at: **http://localhost:4000/api-docs**

### Adding API Documentation

Document your routes using JSDoc comments:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", UserController.getAllUsers);
```

## 🏗️ Building for Production

Build all applications:

```bash
npm run build
```

This will:

1. Compile TypeScript to JavaScript
2. Create optimized production bundles
3. Output to `dist/` directories in each app

### Running Production Build

**Frontend:**

```bash
cd apps/frontend
npm run preview
```

**Backend:**

```bash
cd apps/backend
npm run start
```

## 🔧 Configuration

### Turborepo (turbo.json)

Turborepo is configured to:

- Run tasks in parallel when possible
- Cache build outputs for faster rebuilds
- Handle task dependencies automatically

### TypeScript

Each app has its own `tsconfig.json` that extends the root configuration, allowing for app-specific compiler options while maintaining consistency.

### Path Aliases

Frontend includes path aliases for cleaner imports:

```typescript
import { Button } from "@/components/Button";
```

## 📝 Code Style and Linting

Configure ESLint and Prettier for your project:

```bash
# Install ESLint and Prettier
npm install -D eslint prettier eslint-config-prettier

# Add lint script to root package.json
"lint": "turbo run lint",
"format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/tooling changes

## 🐛 Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Change frontend port in vite.config.ts
server: {
  port: 3001  // Change to available port
}

# Change backend port in .env
PORT=4001
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules apps/*/node_modules
npm install
```

### Turbo Cache Issues

Clear Turbo cache:

```bash
npx turbo run build --force
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [Your Email]

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) - Monorepo build system
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Vitest](https://vitest.dev/) - Blazing fast unit test framework

---

Built with ❤️ using modern web technologies
