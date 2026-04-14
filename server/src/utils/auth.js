const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-bk-secret-change-me";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function getBearer(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

function authCustomer(req, res, next) {
  try {
    const token = getBearer(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyToken(token);
    if (payload.role !== "customer") {
      return res.status(403).json({ error: "Customer session required" });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function authStaff(req, res, next) {
  try {
    const token = getBearer(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyToken(token);
    if (payload.role !== "admin" && payload.role !== "employee") {
      return res
        .status(403)
        .json({ error: "Admin or employee access required" });
    }
    req.staff = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.staff?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

module.exports = {
  signToken,
  verifyToken,
  authCustomer,
  authStaff,
  requireAdmin,
};
