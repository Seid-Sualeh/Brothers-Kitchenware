import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { DashboardLayout } from '../../../components/dashboard/layout/DashboardLayout';
import { adminApi } from '../../../lib/adminApi.js';

const AddEmployee = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      await adminApi.post('/api/admin/employees', {
        name,
        email: formData.email.trim(),
        password: formData.password,
      });
      setMsg('Employee created. They can sign in at /admin/signin with role employee.');
      setFormData({ firstName: '', lastName: '', phone: '', email: '', password: '', role: '' });
    } catch (er) {
      setErr(er.response?.data?.error || 'Could not create employee.');
    }
  };

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-12">
          <div className="mb-8">
            <h1 className="fs-3 mb-1">Add Employee</h1>
            <p className="text-muted">Create a new employee account</p>
            {msg && <div className="alert alert-success mt-2 py-2 small">{msg}</div>}
            {err && <div className="alert alert-danger mt-2 py-2 small">{err}</div>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="card">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Create a password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    required
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">
                    Add Employee
                  </button>
                  <Link to="/admin/dashboard" className="btn btn-light">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddEmployee;