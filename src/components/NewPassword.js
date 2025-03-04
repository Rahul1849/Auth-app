import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons

const RegistrationForm = () => {
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };





  
  const handleRegister = () => {
    if (!password || !confirmPassword) {
      setErrorMessage("❌ All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("❌ Passwords do not match. Please try again.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("❌ Password must be at least 6 characters long and include upper case, lower case, numbers, and special characters.");
      return;
    }

    setErrorMessage("");
    
    localStorage.setItem("password", password);
    alert("Password Reset! You can login now.");
    navigate("/login");
  };

  const isFormValid = () => {
    return (
      
      password &&
      confirmPassword &&
      password === confirmPassword &&
      validatePassword(password)
    );
  };

  return (
    <Container className="p-4">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <h2 className="text-center mb-4">Reset Password</h2>
          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
          <Form>
           
            {(
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Min. 6 characters, at least (1 uppercase, 1 number, 1 special character)"
                      required 
                    />
                    <span 
                      className="position-absolute" 
                      style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }} 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                  </div>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Re-enter your password"
                      required 
                    />
                    <span 
                      className="position-absolute" 
                      style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }} 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                  </div>
                </Form.Group>
                <Button onClick={handleRegister} disabled={!isFormValid()} className="w-100">
                  Submit
                </Button>
              </>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
