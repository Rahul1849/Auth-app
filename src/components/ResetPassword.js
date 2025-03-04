import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // Array for OTP input
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle phone number input (allow only numbers, max 10 digits)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const sendOTP = () => {
    setOtpSent(true);
  };

  // OTP verification logic
  const verifyOTP = () => {
    if (otp.join("") === "1234") {
      alert("OTP Verified! You can reset your password now.");
      navigate("/newpassword"); // Redirect to new password page
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle backspace in OTP input
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <Container className="p-4">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <h2 className="text-center mb-4">Reset Password</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>

            {!otpSent ? (
              <Button 
                onClick={sendOTP} 
                disabled={phone.length !== 10} 
                className="w-100 mb-3"
              >
                Send OTP
              </Button>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <div className="otp-inputs d-flex justify-content-center">
                    {otp.map((digit, index) => (
                      <Form.Control
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onFocus={() => document.getElementById(`otp-${index}`).select()}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        maxLength={1}
                        className="text-center mx-1"
                        style={{ width: "40px", height: "40px", fontSize: "18px", textAlign: "center" }}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Button 
                  onClick={verifyOTP} 
                  disabled={otp.join("").length !== 4} 
                  className="w-100 mb-3"
                >
                  Verify OTP
                </Button>
              </>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
