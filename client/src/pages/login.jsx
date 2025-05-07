import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook to navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Optionally store token (if received)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Navigate to home page
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Error during login:', errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Navigate to signup page
  const goToSignup = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-heading">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="login-input"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="login-input"
          onChange={handleChange}
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="signup-link">
        <p>Don't have an account? <button onClick={goToSignup} className="signup-button">Sign Up</button></p>
      </div>
    </div>
  );
};

export default Login;
