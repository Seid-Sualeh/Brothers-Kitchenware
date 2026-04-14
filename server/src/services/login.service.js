const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db.config');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('email and password are required');
  }

  const [rows] = await pool.query(
    'SELECT id, email, password_hash, name, role FROM users WHERE email = ? LIMIT 1',
    [email],
  );

  if (!rows.length) {
    throw new Error('Invalid credentials');
  }

  const user = rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

module.exports = {
  login,
};
