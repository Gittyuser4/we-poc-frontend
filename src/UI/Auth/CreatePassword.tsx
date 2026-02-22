import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Card, Container, Row, Col, Button, Alert } from "react-bootstrap";

const CreatePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inviteId = useMemo(
    () => searchParams.get("invite_id") || "",
    [searchParams]
  );

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!inviteId)
      newErrors.invite_id = "Invalid or missing invite link.";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      const res = await fetch(
        `${API_BASE_URL}/api/auth/admin/activate/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invite_id: inviteId,
            password: formData.password,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok)
        throw new Error(
          data?.message || data?.error || "Activation failed"
        );

      navigate("/login");
    } catch (err: any) {
      setErrors({ invite_id: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={9} md={7} lg={5} xl={4}>
          <Card className="shadow">
            <Card.Body>

              {/* Logo */}
              <div className="text-center mb-3">
                <img
                  src="/logo.png"   
                  alt="Logo"
                  style={{ width: "200px", height:"200px", marginBottom:"-40px"}}
                />
              </div>
    

              <h4 className="text-center mb-2">
                Set your password
              </h4>

              <p className="text-center text-muted small mb-5">
                Enter your new password below to activate your account
              </p>

              {errors.invite_id && (
                <Alert variant="warning">
                  {errors.invite_id}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    New Password <span className="text-danger">*</span>
                  </Form.Label>

                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder=""
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      disabled={submitting}
                    />

                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      } password-toggle-icon`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>

                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>

                  <div className="password-input-wrapper">
                    <Form.Control
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder=""
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      disabled={submitting}
                    />

                    <i
                      className={`bi ${
                        showConfirmPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      } password-toggle-icon`}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    ></i>
                  </div>

                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="px-5 custom-yellow-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Set Password"}
                  </Button>

                  {/* <div className="text-center mt-4">
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer", fontSize: "14px" }}
                      onClick={() => navigate("/login")}
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Back to Login Page
                    </span>
                  </div> */}
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePassword;
