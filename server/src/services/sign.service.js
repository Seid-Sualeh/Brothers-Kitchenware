const bcrypt = require('bcryptjs');
const { pool } = require('../config/db.config');

async function signup({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('name, email, and password are required');
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) {
    throw new Error('Email already registered');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password_hash, 'customer'],
  );

  return {
    id: result.insertId,
    name,
    email,
    role: 'customer',
  };
}

module.exports = {
  signup,
};
