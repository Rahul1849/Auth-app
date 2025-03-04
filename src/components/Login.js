import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/SignUp.css"; // Import the same styling as SignUp

// ✅ Load environment variable
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isValidInput = () => {
    return (
      loginInput.length > 0 &&
      (loginInput.includes("@") || /^\d{12}$/.test(loginInput)) // Valid email or 12-digit phone number
    );
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("⚠️ Please complete the CAPTCHA.");
      return;
    }

    const storedEmail = localStorage.getItem("email");
    const storedPhone = localStorage.getItem("phone");
    const storedPassword = localStorage.getItem("password");

    if (
      (loginInput === storedEmail || loginInput === storedPhone) &&
      password === storedPassword
    ) {
      alert("✅ Login successful! Redirecting to Home...");
      navigate("/home");
    } else {
      alert("❌ Invalid email/phone or password. Please try again.");
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="signup-row">
        {/* Sidebar Section */}
        <Col className="sidebar">
          <div className="company-info">
            <img src="/logo.png" alt="Company Logo" className="company-logo" />
            <h3 className="company-name">Vimala Care</h3>
            <p className="company-goal"></p>
          </div>
        </Col>

        {/* Login Form Section */}
        <Col className="signup-form">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Email or Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label></Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </Form.Group>

            {/* Center CAPTCHA below the password */}
            <div
              className="mt-3 recaptcha-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
              ) : (
                <p style={{ color: "red" }}>⚠️ reCAPTCHA key is missing!</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-100 mt-3"
              disabled={!captchaValue || !isValidInput() || password.length === 0}
            >
              Login
            </Button>

            <Button
              variant="link"
              onClick={() => navigate("/reset-password")}
              className="d-block text-center mt-2"
            >
              Forgot Password?
            </Button>

            {/* Add Signup Link */}
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <span
                style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => navigate("/sign")}
              >
                Sign Up
              </span>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
