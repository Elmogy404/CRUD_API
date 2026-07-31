const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            done: { type: "boolean" },
          },
        },
      },
    },
  },
  apis: ["./index.js"],
};
let todos = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build a CRUD API", done: true },
  { id: 3, title: "Submit assignment", done: false },
];
let nextidx = 4;
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
/**
 * @swagger
 * /:
 *   get:
 *     summary: API info
 *     responses:
 *       200:
 *         description: API information
 */
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/tasks", (req, res) => {
  res.json(todos);
});
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Title is required
 */
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }
  const newTask = {
    id: nextidx++,
    title,
    done: false,
  };
  todos.push(newTask);
  res.status(201).json(newTask);
});
/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    summary: Read a specifc task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: NOT found
 *      200:
 *        description: found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *
 */
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (id >= nextidx || id <= 0) {
    return res.status(404).json({ error: "Task " + id + " not found" });
  } else if (!todos[id - 1]) {
    return res.status(404).json({ error: `Task ${id} not found` });
  } else {
    return res.status(200).json(todos[id - 1]);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    summary: update a task
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              done:
 *                type: boolean
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *       404:
 *          description: NOT found
 *       400:
 *          description: Invalid request body
 *       200:
 *          description: UPDATED!!
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Task'
 */
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;
  if (id >= nextidx || id <= 0) {
    return res.status(404).json({ error: "Task " + id + " not found" });
  }
  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof done !== "boolean"
  ) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  todos[id - 1].title = title;
  todos[id - 1].done = done;
  return res.status(200).json(todos[id - 1]);
});

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    summary: delete a task
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      404:
 *        description: NOT found
 *      204:
 *        description: DELETED!!
 */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (id <= 0 || id >= nextidx) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  todos.splice(id - 1, 1);

  todos.forEach((task, index) => {
    task.id = index + 1;
  });
  nextidx = todos.length + 1;
  return res.sendStatus(204);
});
