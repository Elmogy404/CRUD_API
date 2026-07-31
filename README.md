# Todo API

A simple RESTful Todo API built with Node.js and Express. It supports full CRUD operations (Create, Read, Update, Delete) using in-memory storage. The API is documented with Swagger (OpenAPI).

## Features

- Create tasks
- Read all tasks
- Read a single task
- Update tasks
- Delete tasks
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
http://localhost:3000/api-docs
```

## API Endpoints

| Method | Endpoint   | Description      |
| ------ | ---------- | ---------------- |
| GET    | /          | API information  |
| GET    | /health    | Health check     |
| GET    | /tasks     | Get all tasks    |
| GET    | /tasks/:id | Get a task by ID |
| POST   | /tasks     | Create a task    |
| PUT    | /tasks/:id | Update a task    |
| DELETE | /tasks/:id | Delete a task    |

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

## Swagger UI

Open:

```
http://localhost:3000/api-docs
```

Add your Swagger screenshot below.

![Swagger UI](images/swagger.png)

## License

This project was created for learning purposes.
