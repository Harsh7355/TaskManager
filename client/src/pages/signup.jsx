import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import './signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });

  const navigate = useNavigate(); // Hook to navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created successfully:', data);

        // Redirect to login page
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error during signup:', errorData.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  // Navigate to login page
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          autoComplete="off"
          className="signup-input"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="off"
          className="signup-input"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="off"
          required
          className="signup-input"
          onChange={handleChange}
        />
        <input
          name="country"
          type="text"
          placeholder="Country"
          required
          autoComplete="off"
          className="signup-input"
          onChange={handleChange}
        />

        <button type="submit" className="signup-button">
          Create Account
        </button>
      </form>

      <div className="login-link">
        <p>Already have an account? <button onClick={goToLogin} className="login-button">Login</button></p>
      </div>
    </div>
  );
};

export default Signup;
