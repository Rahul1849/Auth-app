import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons
import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import ReCAPTCHA

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY; // ✅ Load ReCAPTCHA key

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // Array for OTP input
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Unused variable fixed
  const [agreeToTerms, setAgreeToTerms] = useState(false); // New state for checkbox
  const [isFormValid, setIsFormValid] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(100); // 100 seconds timer
  const [captchaValue, setCaptchaValue] = useState(null); // ✅ New state for CAPTCHA
  const navigate = useNavigate();

  useEffect(() => {
    const isValidPassword = validatePassword(password);
    const allFieldsFilled =
      firstName.trim() &&
      lastName.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword &&
      isValidPassword;

    if (email) {
      setIsFormValid(allFieldsFilled && otpVerified && captchaValue);
    } else {
      setIsFormValid(allFieldsFilled && captchaValue);
    }
  }, [firstName, lastName, password, confirmPassword, email, otpVerified, captchaValue]);

  useEffect(() => {
    let timer;
    if (otpSent && resendTimeout > 0) {
      timer = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendTimeout]);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const sendOTP = () => {
    if (email) {
      console.log(`Sending OTP to: ${email}`);
      setOtpSent(true);
      setResendTimeout(100); // Reset timer to 100 seconds
    }
  };

  const verifyOTP = () => {
    if (otp.join("") === "1234") {
      setOtpVerified(true);
      alert("OTP verified successfully!");
      setErrorMessage(""); // Clear error message on successful verification
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (otpVerified) return; // Prevent editing after verification

    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpBackspace = (index, e) => {
    if (otpVerified) return;

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }

    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
  };

  const handleRegister = () => {
    if (!isFormValid) {
      setErrorMessage("Please fill all required fields correctly.");
      return;
    }

    if (!captchaValue) { // ✅ Validate CAPTCHA
      setErrorMessage("Please complete the CAPTCHA.");
      return;
    }

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <Container className="p-4">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <h2 className="text-center mb-4">Complete Registration</h2>
          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email (Optional)</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={!firstName.trim() || !lastName.trim()} // Disable until first and last name are filled
              />
            </Form.Group>

            {email && !otpSent ? (
              <Button
                onClick={sendOTP}
                disabled={!email}
                className="w-100 mb-3"
              >
                Send OTP
              </Button>
            ) : null}

            {otpSent && (
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
                        onKeyDown={(e) => handleOtpBackspace(index, e)}
                        maxLength={1}
                        className="text-center mx-1"
                        style={{ width: "40px", height: "40px" }}
                        disabled={otpVerified}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Button
                  onClick={verifyOTP}
                  disabled={otp.join("").length !== 4 || otpVerified}
                  className="w-100 mb-3"
                >
                  {otpVerified ? "Verified" : "Verify OTP"}
                </Button>
              </>
            )}

            {(otpVerified || !email) && (
              <>
                <Form.Group className="mb-4">
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
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
                  <Form.Label>
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
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

                <Form.Group className="mb-3">
  <Form.Check
    type="checkbox"
    label={
      <>
        I agree to the Terms and Conditions <span className="text-danger">*</span>
      </>
    }
    checked={agreeToTerms}
    onChange={(e) => setAgreeToTerms(e.target.checked)}
    required
  />
</Form.Group>

{/* ✅ CAPTCHA added here */}
<div className="mb-3 d-flex justify-content-center">
                  <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptchaValue} />
                </div>

<Button onClick={handleRegister} className="w-100" disabled={!isFormValid || !agreeToTerms || !captchaValue}>
  Sign Up
</Button>

              </>
            )}
            {resendTimeout <= 0 && !otpSent && (
              <Button
                onClick={sendOTP}
                className="w-100 mb-3"
                disabled={otpSent}
              >
                Resend OTP
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
