import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

interface MobileVerificationScreenProps {
  onVerified: (mobile: string) => void;
}

const MobileVerificationScreen: React.FC<MobileVerificationScreenProps> = ({ onVerified }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    onVerified(mobileNumber);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setMobileNumber(value);
      setError(null);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }} className="mb-3">
                  📱
                </div>
                <h3 className="mb-2">Welcome!</h3>
                <p className="text-muted">
                  Please enter your mobile number to begin the survey
                </p>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    maxLength={10}
                    className="form-control-lg"
                    autoFocus
                    disabled={isValidating}
                  />
                  <Form.Text className="text-muted">
                    Your mobile number is only used to prevent duplicate submissions
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={mobileNumber.length !== 10 || isValidating}
                >
                  {isValidating ? 'Verifying...' : 'Continue'}
                </Button>
              </Form>

              <div className="mt-4 text-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your information is secure and anonymous
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MobileVerificationScreen;
