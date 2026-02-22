import React from 'react';
import { Form } from 'react-bootstrap';

interface RadioGroupProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  inline?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
  inline = true,
}) => {
  return (
    <Form.Group className="mb-4 question-container">
      <Form.Label className="fw-bold">{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <div className={inline ? 'd-flex gap-4' : ''}>
        {options.map((option, index) => (
          <Form.Check
            key={index}
            type="radio"
            id={`${id}-${index}`}
            name={id}
            label={option}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            inline={inline}
          />
        ))}
      </div>
    </Form.Group>
  );
};

export default RadioGroup;
