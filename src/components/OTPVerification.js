import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    // Logic to verify OTP (e.g., API call)
    if (otp === "1234") { // Replace this with your actual verification logic
      alert("OTP verified successfully!");
      navigate("/dashboard"); // Redirect to the dashboard on success
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>OTP Verification</h2>
          <Form onSubmit={handleVerify}>
            <Form.Group>
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Verify</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OTPVerification;
