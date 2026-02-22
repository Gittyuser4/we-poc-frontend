import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface CardSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[] | Array<{ code?: string; label: string; value?: string }>;
  onChange: (value: string) => void;
  required?: boolean;
}

const CardSelect: React.FC<CardSelectProps> = ({
  // id,
  label,
  value,
  options,
  onChange,
  required = false,
}) => {
  const isObjectOptions = Array.isArray(options) && options.length > 0 && typeof options[0] === 'object';

  return (
    <Form.Group className="mb-4 question-container">
      <Form.Label className="fw-bold">{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <Row className="g-3">
        {options.map((option, index) => {
          const optionValue = isObjectOptions ? ((option as any).code || (option as any).value || (option as any).label) : option as string;
          const optionLabel = isObjectOptions ? (option as any).label : option as string;
          const isActive = value === optionValue;
          
          return (
            <Col key={index} xs={12} sm={6} md={4}>
              <div
                className={`card-select ${isActive ? 'active' : ''}`}
                onClick={() => onChange(optionValue)}
              >
                <div className="card-select-content">
                  <span>{optionLabel}</span>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Form.Group>
  );
};

export default CardSelect;
