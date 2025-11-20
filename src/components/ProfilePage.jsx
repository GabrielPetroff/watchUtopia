import { useState } from 'react';
import authService from '../services/auth/authServive.js';
export default function ProfilePage() {
  // State variables to manage form inputs and error/success messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Call the register method from authService
      const result = await authService.register(email, password);

      if (result.success) {
        // Handle success: show a success message
        setSuccessMessage(
          'Registration successful! Please check your email for verification.'
        );
      } else {
        // Handle error: show the error message
        setErrorMessage(
          result.message || 'An error occurred during registration.'
        );
      }
    } catch (error) {
      // Catch any unexpected errors
      setErrorMessage('An unexpected error occurred.');
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
}
