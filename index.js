const express = require('express');
const app =express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo API",
            version: "1.0.0",
        },
    },
    apis: ["./index.js"]
};
let todos =[ { id: 1, title: "Learn Express", done: false },
    { id: 2, title: "Build a CRUD API", done: true },
    { id: 3, title: "Submit assignment", done: false }];
    let nextidx=4;
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
app.get("/", (req, res) => {
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});
app.get("/health", (req, res) => { res.json({status: "ok"}); });
app.get("/tasks", (req,res) => {res.json(todos);});
app.post("/tasks", (req, res) => {
    const {title}=req.body;
    if(!title||title.trim()===""){
        return res.status(400).json({error: "Title is required"})
    }
    const newTask = {id: nextidx++, title, done: false};
    todos.push(newTask);
    res.status(201).json(newTask);
});