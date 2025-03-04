import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import "../styles/SignUp.css"; // Import CSS file for styling

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); 
  const [timer, setTimer] = useState(100);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const isPhoneValid = phone.length >= 12; // Ensure the phone number is valid

  const sendOTP = () => {
    console.log("Sending OTP to:", phone);
    setOtpSent(true);
    setTimer(100);
  };

  const verifyOTP = () => {
    if (otp.join("") === "1234") { 
      setVerified(true);
      alert("OTP verified successfully!");
      localStorage.setItem("phone", phone); 
      navigate("/register");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const resendOTP = () => {
    console.log("Resending OTP...");
    setTimer(100); 
    setOtp(["", "", "", ""]);
  };

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

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = ""; 
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus(); 
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="signup-row">
        <Col className="sidebar">
          <div className="company-info">
            <img src="/logo.png" alt="Company Logo" className="company-logo" />
            <h3 className="company-name">Vimala Care</h3>
            <p className="company-goal"></p>
          </div>
        </Col>

        <Col className="signup-form">
          <h2>Sign Up</h2>
          <Form>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "16px",
                }}
              />
            </Form.Group>

            {!otpSent ? (
              <Button onClick={sendOTP} disabled={!isPhoneValid}>
                Get OTP
              </Button>
            ) : (
              <>
                <Form.Group>
                  <Form.Label>Enter OTP</Form.Label>
                  <div className="otp-inputs">
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
                        style={{ width: "40px", margin: "0 5px", height: "40px" }}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Button onClick={verifyOTP} disabled={otp.join("").length !== 4 || timer === 0}>
                  Verify
                </Button>

                <p>{`Time remaining: ${timer}s`}</p>

                {timer === 0 && (
                  <Button onClick={resendOTP} variant="secondary">
                    Resend OTP
                  </Button>
                )}
              </>
            )}
            {verified && <h5>OTP Verified Successfully!</h5>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
