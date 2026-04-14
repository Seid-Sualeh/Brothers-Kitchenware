const bcrypt = require("bcryptjs");

async function addEmployee(db, { email, password, name }) {
  const hash = bcrypt.hashSync(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    [email.trim().toLowerCase(), hash, name.trim(), "employee"],
  );
  return { id: result.insertId, email, name, role: "employee" };
}

module.exports = { addEmployee };
