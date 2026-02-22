import { useState } from 'react';
import { Form, Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { authService } from '../../services/authService';

const Invite = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    mobile: '',
    location: '',
    note: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For mobile, only allow digits
    if (name === 'mobile') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: cleanedValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await authService.inviteAdmin(formData);
      setSuccessMessage(response.message || 'invition sent successfully!');
      
      // Reset form
      setFormData({
        email: '',
        full_name: '',
        mobile: '',
        location: '',
        note: ''
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
        <Container>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <Col xs={12} sm={10} md={8} lg={6}>
                <Card className="shadow">
                  <Card.Body style={{ minHeight: "300px" }}>

                    {/* Logo */}
              <div className="text-center mb-3">
                <img
                  src="/logo.png"   
                  alt="Logo"
                  style={{ width: "200px", height:"200px", marginBottom:"-40px"}}
                />
              </div>
                    <h4 className="text-center mb-4">Invite Admin</h4>

                    {successMessage && (
                      <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
                        {successMessage}
                      </Alert>
                    )}

                    {errorMessage && (
                      <Alert variant="danger" dismissible onClose={() => setErrorMessage(null)}>
                        {errorMessage}
                      </Alert>
                    )}
 
                    <Form onSubmit={handleSubmit}>
                      {/* Email */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter Email Id"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          disabled={submitting}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
 
                      {/* Full Name */}
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          placeholder="Enter Full Name"
                          value={formData.full_name}
                          onChange={handleChange}
                          disabled={submitting}
                        />
                      </Form.Group>
 
                      {/* Mobile Number */}
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Mobile Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          placeholder="Enter 10-digit Mobile Number"
                          value={formData.mobile}
                          onChange={handleChange}
                          maxLength={10}
                          isInvalid={!!errors.mobile}
                          disabled={submitting}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mobile}
                        </Form.Control.Feedback>
                      </Form.Group>
 
                      {/* Location */}
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="Enter location"
                          value={formData.location}
                          onChange={handleChange}
                          disabled={submitting}
                        />
                      </Form.Group>
 
                      {/* Note */}
                      <Form.Group className="mb-4">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="note"
                          rows={3}
                          placeholder="Write a message for the invited person..."
                          value={formData.note}
                          onChange={handleChange}
                          disabled={submitting}
                        />
                      </Form.Group>
 
                        {/* Submit Button */}
                        <div className="text-center">
                          <Button 
                            variant="primary" 
                            className="px-5" 
                            type="submit"
                            disabled={submitting}
                          >
                            {submitting ? 'Sending...' : 'Send Invite'}
                          </Button>
                        </div>
                      </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
 
      
  )
}

export default Invite
