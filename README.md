<img width="1910" height="971" alt="Screenshot 2026-05-21 182950" src="https://github.com/user-attachments/assets/6002f82b-0ae5-4d7a-ae8a-95d0608df48c" />
<img width="1904" height="966" alt="Screenshot 2026-05-21 183007" src="https://github.com/user-attachments/assets/a0c377eb-da61-430c-b519-e3d151ee63e2" />

# TaskFlow API 🚀

Scalable REST API with JWT Authentication, Role-Based Access Control, and a React frontend demo.

Built for the **Backend Developer Intern Assignment**.

---

## Stack

| Layer      | Tech                                      |
|------------|-------------------------------------------|
| Runtime    | Node.js 20 + TypeScript                   |
| Framework  | Express 5                                 |
| Database   | PostgreSQL 16 + Prisma ORM                |
| Auth       | JWT (access 15m + refresh 7d) + bcrypt    |
| Validation | Zod                                       |
| Caching    | Redis (optional)                          |
| Docs       | Swagger / OpenAPI 3.0                     |
| Frontend   | Vanilla HTML/CSS/JS (demo portal)         |
| Infra      | Docker + Docker Compose                   |

---

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/your-username/taskflow-api.git
cd taskflow-api
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secrets
```

### 3. Start with Docker (recommended)
```bash
docker-compose up -d
```

### 4. Run migrations & start dev server
```bash
npm run db:push       # apply Prisma schema to DB
npm run dev           # starts on http://localhost:4000
```

---

## API Endpoints

| Method | Path                    | Auth    | Description            |
|--------|-------------------------|---------|------------------------|
| POST   | /api/v1/auth/register   | —       | Register user          |
| POST   | /api/v1/auth/login      | —       | Login, get JWT pair    |
| POST   | /api/v1/auth/refresh    | —       | Rotate access token    |
| POST   | /api/v1/auth/logout     | JWT     | Revoke refresh token   |
| GET    | /api/v1/users/me        | JWT     | My profile             |
| GET    | /api/v1/users           | ADMIN   | List all users         |
| POST   | /api/v1/tasks           | JWT     | Create task            |
| GET    | /api/v1/tasks           | JWT     | My tasks (filtered)    |
| GET    | /api/v1/tasks/:id       | JWT     | Get task by ID         |
| PATCH  | /api/v1/tasks/:id       | JWT     | Update task            |
| DELETE | /api/v1/tasks/:id       | JWT     | Delete task            |
| GET    | /api/v1/tasks/all       | ADMIN   | All users' tasks       |

Full interactive docs: **http://localhost:4000/api/docs**

---

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT access tokens expire in **15 minutes**
- Refresh tokens hashed before storage, expire in **7 days**
- **Helmet** sets secure HTTP headers
- **Rate limiting** — 100 req/15min global, 10 req/15min on auth routes
- **Zod** validates and sanitizes all inputs
- **CORS** whitelist via env config

---

## Scalability Notes

- **Stateless JWTs** → horizontal scaling with load balancers
- **Redis** caching for sessions and rate-limit state
- **Read replicas** + PgBouncer for DB scaling
- **Modular architecture** → easy microservice extraction
- **Docker + Kubernetes** ready for auto-scaling
- See `SCALABILITY.md` for the full architecture note

---

## Project Structure

```
taskflow-api/
├── backend/src/
│   ├── modules/          # Feature modules (auth, tasks, users)
│   ├── middleware/       # authenticate, authorize, errorHandler, rateLimiter
│   ├── config/           # db, redis, env (Zod-validated)
│   ├── utils/            # jwt, logger, ApiError
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── frontend/             # Demo portal (HTML/CSS/JS)
├── docs/
│   ├── openapi.yaml
│   └── postman_collection.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## License
MIT
