const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { notifyAdmins } = require("../services/admin.service");

const JWT_SECRET = process.env.JWT_SECRET || "dev-bk-secret-change-me";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

async function signinController(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const [result] = await req.db.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
      [email.trim().toLowerCase(), hash, name.trim(), "customer"],
    );
    const user = {
      id: result.insertId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: "customer",
    };
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await notifyAdmins(req.db, {
      type: "user_registration",
      title: "New User Registration",
      body: `${name} (${email}) has registered as a new customer.`,
    });
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = { signinController };

module.exports = {
  signin,
};
