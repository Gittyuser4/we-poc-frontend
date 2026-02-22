import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import "./login.css";

// Import images
import udyoginiImage from "../../assets/Udyogini_Scheme.jpg";
import farmersImage from "../../assets/farmers.webp";
import graduatesImage from "../../assets/graduates.jpg";
import groupImage from "../../assets/group_image.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Create 2x2 grid of images (4 tiles)
  const images = [
    udyoginiImage, farmersImage,
    graduatesImage, groupImage
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login({
        email: username,
        password: password,
      });

      // Redirect to admin dashboard after successful login
      navigate("/admin");
    } catch (err: any) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 2x2 Image Grid Background */}
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="grid-item">
            <img src={img} alt={`Background ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Login Form - Centered */}
      <div className="glass-login-card">
        {/* Logo */}
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="login-logo" style={{backgroundColor:'white'}} />
        </div>
        
        <h3 className="login-title">Admin Portal</h3>
        <p className="login-subtitle">Women Empowerment Survey</p>

        <Form onSubmit={handleLogin}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">
              {error}
            </Alert>
          )}
          {/* Username */}
          <Form.Group className="mb-3">
            <div className="pill-input">
              <Form.Control
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="input-icon">
                {/* User Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <div className="pill-input">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div
                className="input-icon"
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  /* Eye Open */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Eye Off */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </div>
            </div>
          </Form.Group>

          {/* Remember / Forgot */}
          {/* <div className="login-options">
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
            <a href="#">Forgot password?</a>
          </div> */}

          {/* Login button */}
          <Button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

        </Form>
      </div>
    </div>
  );
};

export default Login;
