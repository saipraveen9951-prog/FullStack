# Todo Manager Server (Backend)

An enterprise-grade, secure, and paginated REST API backend for the Todo Manager application, built using **Node.js**, **Express.js**, **PostgreSQL**, and **Drizzle ORM**. It implements code segregation through the Repository-Service design pattern, ensures data safety via Zod schemas, and incorporates production security plugins.

---

## 🛠️ Tech Stack

*   **Runtime & Server**: Node.js, Express.js
*   **Database**: PostgreSQL
*   **ORM**: Drizzle ORM
*   **Validation**: Zod
*   **Security & Optimization**: Helmet, CORS, Express Rate Limit, Gzip Compression
*   **Logging**: Morgan (HTTP query stream), Custom Timestamps Logger

---

## 📂 Architecture & Folder Structure

We follow a clean, scalable Repository-Service separation of concerns:

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # Pg Pool connection & Drizzle binding
│   │   └── env.js            # Environment validation using Zod
│   ├── db/
│   │   ├── schema.js         # PostgreSQL schema definition
│   │   ├── migrations/       # Compiled SQL files
│   │   ├── migrate.js        # Drizzle migrator runner script
│   │   └── seed.js           # Database test seeder
│   ├── repositories/
│   │   └── todoRepository.js # Raw database CRUD queries
│   ├── services/
│   │   └── todoService.js    # Business validations and pagination logic
│   ├── controllers/
│   │   └── todoController.js # Request mapping and response structures
│   ├── routes/
│   │   └── todoRoutes.js     # Route verb paths
│   ├── validations/
│   │   └── todoValidation.js # Zod schemas for body, query, and params
│   ├── middleware/
│   │   ├── validateRequest.js# Zod error formatting middleware
│   │   ├── errorHandler.js   # Global operational error handler
│   │   └── notFound.js       # Unmatched route catcher (404)
│   ├── utils/
│   │   ├── ApiError.js       # Normalized error class wrapper
│   │   ├── ApiResponse.js    # Normalized success response class
│   │   └── logger.js         # Logging levels configuration
│   ├── app.js                # Express app middleware and plugin registers
│   └── server.js             # App entry, pool check, and graceful shutdowns
├── .env                      # Local environment configurations
├── drizzle.config.js         # Drizzle Kit migration configuration
└── package.json
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## ⚙️ Database Management Commands

The project uses Drizzle Kit to sync database structures:

1.  **Generate Migration SQL Files**:
    Computes schema differences and creates files inside `src/db/migrations/`:
    ```bash
    npm run db:generate
    ```

2.  **Execute Migrations**:
    Applies compiled migration SQL files to the database:
    ```bash
    npm run db:migrate
    ```

3.  **Seed Database**:
    Inserts initial tasks to preview queries immediately (only if table is empty):
    ```bash
    npm run db:seed
    ```

4.  **Schema push**:
    Pushes schema directly without generating SQL files (for rapid dev):
    ```bash
    npm run db:push
    ```

5.  **Drizzle Studio**:
    Opens a database inspector GUI inside the browser:
    ```bash
    npm run db:studio
    ```

---

## 🔌 API Endpoints

### 1. Health Monitor
*   **Path**: `GET /health`
*   **Response**:
    ```json
    {
      "status": "UP",
      "timestamp": "2026-06-06T12:00:00.000Z",
      "env": "development"
    }
    ```

### 2. Fetch Tasks (Paginated, Sorted, Filtered)
*   **Path**: `GET /api/todos`
*   **Query Parameters (All optional)**:
    *   `page`: Target page index (Default: `1`)
    *   `limit`: Page size limit (Default: `10`, max 100)
    *   `search`: Case-insensitive title searching (`ILIKE`)
    *   `status`: Filter task state (`completed`, `pending`, `all`)
    *   `sortBy`: Sort field target (`createdAt`, `title`, `completed`)
    *   `order`: Sort order (`asc`, `desc`)
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Todos fetched successfully",
      "data": [
        {
          "id": "uuid-v4",
          "title": "Build backend system",
          "description": "Using Express and PostgreSQL",
          "completed": false,
          "createdAt": "2026-06-06T12:00:00Z",
          "updatedAt": "2026-06-06T12:00:00Z"
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPrevPage": false
      }
    }
    ```

### 3. Fetch Single Task
*   **Path**: `GET /api/todos/:id`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Todo fetched successfully",
      "data": { "id": "uuid-v4", "title": "Build backend system", ... }
    }
    ```

### 4. Create Task
*   **Path**: `POST /api/todos`
*   **Payload**:
    ```json
    {
      "title": "Build backend system",
      "description": "Optional details"
    }
    ```
*   **Validations**:
    *   `title` is required, min 3 characters, max 255 characters.
    *   Blocks creation if a task with the same title is active/pending.
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Todo created successfully",
      "data": { "id": "uuid-v4", ... }
    }
    ```

### 5. Update Task
*   **Path**: `PUT /api/todos/:id`
*   **Payload**:
    ```json
    {
      "title": "Updated title",
      "description": "Updated details",
      "completed": true
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Todo updated successfully",
      "data": { ... }
    }
    ```

### 6. Delete Task
*   **Path**: `DELETE /api/todos/:id`
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Todo deleted successfully"
    }
    ```

---

## 💻 Running the Server

### 1. Installation
```bash
cd backend
npm install
```

### 2. Development Mode (Hot-Reload)
```bash
npm run dev
```
The server will bind locally and listen at [http://localhost:5000/](http://localhost:5000/).
