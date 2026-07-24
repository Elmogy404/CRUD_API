const express = require("express");

const router = express.Router();
const todos = [];
router.get("/", (req, res) => {
    res.json(todos);
});
router.post("/",(req,res)=> {
    todos.push(req.body);
    res.status(201).json({
        message: "TODO created",
        data: req.body
    });
});
module.exports = router;