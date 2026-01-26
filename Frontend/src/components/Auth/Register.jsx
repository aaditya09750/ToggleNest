import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-xl border border-border-dark">
        <div>
          <h2 className="mt-2 text-center text-3xl font-semibold text-text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Join ToggleNest today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-border-error/10 border border-border-error text-border-error px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-3 bg-background border border-border-dark rounded-xl shadow-sm placeholder-text-secondary text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-3 bg-background border border-border-dark rounded-xl shadow-sm placeholder-text-secondary text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-3 bg-background border border-border-dark rounded-xl shadow-sm placeholder-text-secondary text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-3 bg-background border border-border-dark rounded-xl shadow-sm placeholder-text-secondary text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="bg-surface border border-primary/30 rounded-lg p-3">
            <p className="text-xs text-primary">
              <span className="font-semibold">Note:</span> First registered user
              becomes Admin automatically. All subsequent users will be Team
              Members.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
