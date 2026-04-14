const express = require("express");
const { signinController } = require("../controllers/signin.controller");

const router = express.Router();

router.post("/signin", signinController);

module.exports = router;
