const express = require("express");

const router = express.Router();

const {
    executeQuery,
} = require("../controllers/queryController");

router.post("/", executeQuery);

module.exports = router;