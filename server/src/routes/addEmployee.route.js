const express = require("express");
const {
  addEmployeeController,
} = require("../controllers/addEmployee.controller");

const router = express.Router();

router.post("/add-employee", addEmployeeController);

module.exports = router;
