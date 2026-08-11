# Todo API

A simple RESTful Todo API built with Node.js and Express. It supports full CRUD operations (Create, Read, Update, Delete) using in-memory storage. The API is documented with Swagger (OpenAPI).

## Features

- Create tasks
- Read all tasks
- Read a single task
- Update tasks
- Delete tasks
- Filter tasks by done status
- Search tasks by title
- Task statistics
- Request validation
- Swagger UI documentation

## Technologies

- Node.js
- Express.js
- Swagger UI
- swagger-jsdoc

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/CRUD_API.git
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
node index.js
```

Or during development:

```bash
npx nodemon index.js
```

The server runs on:

```
http://localhost:3000
```

Swagger UI:

```
http://localhost:3000/docs
```

## API Endpoints

| Method | Endpoint   | Description                         |
| ------ | ---------- | ----------------------------------- |
| GET    | /          | API information                     |
| GET    | /health    | Health check                        |
| GET    | /stats     | Task statistics                     |
| GET    | /tasks     | Get tasks (filter by `done`, `search`) |
| GET    | /tasks/:id | Get a task by ID                    |
| POST   | /tasks     | Create a task                       |
| PUT    | /tasks/:id | Update a task (title and/or done)   |
| DELETE | /tasks/:id | Delete a task                       |

## Example cURL

Create a task:

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d "{\"title\":\"Buy milk\"}"
```

Example response:

```json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

Get pending tasks:

```bash
curl http://localhost:3000/tasks?done=false
```

Search tasks by title:

```bash
curl http://localhost:3000/tasks?search=express
```

Get task statistics:

```bash
curl http://localhost:3000/stats
```

Example response:

```json
{
  "total": 4,
  "done": 1,
  "pending": 3
}
```

Update a task (partial update):

```bash
curl -X PUT http://localhost:3000/tasks/4 \
-H "Content-Type: application/json" \
-d "{\"done\":true}"
```

## Swagger UI

Open:

```
http://localhost:3000/docs
```

Add your Swagger screenshot below.

![Swagger UI](images/swagger.png)

## License

This project was created for learning purposes.
