import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

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
      (loginInput.includes("@") || /^\d{12}$/.test(loginInput)) // Valid email or 10-digit phone number
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
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email or Phone Number
              </Form.Label>
              <Form.Control
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Enter your email or phone number(add 91 before phone number)"
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="mt-4 recaptcha-container">
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
          </Form>

          <Button variant="link" onClick={() => navigate("/reset-password")} className="d-block text-center mt-2">
            Forgot Password?
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
