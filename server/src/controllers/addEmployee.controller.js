const { addEmployee } = require("../services/addEmployee.service");

async function addEmployeeController(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }
    const employee = await addEmployee(req.db, { email, password, name });
    res.status(201).json({ employee });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addEmployeeController };
