const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//
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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

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
 * /stats:
 *   get:
 *     summary: Task statistics
 *     responses:
 *       200:
 *         description: Count of total, done and pending tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 done:
 *                   type: integer
 *                 pending:
 *                   type: integer
 */
app.get("/stats", (req, res) => {
  const total = todos.length;
  const done = todos.filter((task) => task.done).length;
  res.json({ total, done, pending: total - done });
});
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     parameters:
 *       - in: query
 *         name: done
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter tasks by completion status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title
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
  let result = todos;
  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    result = result.filter((task) => task.done === done);
  }
  if (req.query.search) {
    result = result.filter((task) =>
      task.title.toLowerCase().includes(req.query.search.toLowerCase()),
    );
  }
  res.status(200).json(result);
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
  const task = todos.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  } else {
    return res.status(200).json(task);
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
  const task = todos.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task " + id + " not found" });
  }
  const { title, done } = req.body;
  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "At least title or done is required",
    });
  }
  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res.status(400).json({
      error: "Invalid title",
    });
  }
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      error: "Invalid done value",
    });
  }
  if (title !== undefined) {
    task.title = title;
  }
  if (done !== undefined) {
    task.done = done;
  }
  res.status(200).json(task);
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
  const task = todos.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  todos.splice(todos.indexOf(task), 1);
  res.sendStatus(204);
});
