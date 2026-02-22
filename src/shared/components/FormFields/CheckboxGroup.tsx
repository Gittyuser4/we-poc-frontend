import React from 'react';
import { Form } from 'react-bootstrap';

interface CheckboxGroupProps {
  id: string;
  label: string;
  values: string[];
  options: string[] | Array<{ code?: string; label: string; value?: string }>;
  onChange: (values: string[]) => void;
  required?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id,
  label,
  values,
  options,
  onChange,
  required = false,
}) => {
  const isObjectOptions = Array.isArray(options) && options.length > 0 && typeof options[0] === 'object';

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    // Handle "NOT_A_MEMBER" mutually exclusive logic
    if (optionValue === 'NOT_A_MEMBER') {
      if (checked) {
        // If checking "Not a member", clear all other selections
        onChange(['NOT_A_MEMBER']);
      } else {
        // If unchecking "Not a member", just remove it
        onChange(values.filter((v) => v !== optionValue));
      }
    } else {
      // For other options (MEPMA, DWCRA, etc.)
      if (checked) {
        // Remove "NOT_A_MEMBER" if it exists and add the new value
        const newValues = values.filter((v) => v !== 'NOT_A_MEMBER');
        onChange([...newValues, optionValue]);
      } else {
        // Just remove the unchecked value
        onChange(values.filter((v) => v !== optionValue));
      }
    }
  };

  return (
    <Form.Group className="mb-4 question-container">
      <Form.Label className="fw-bold">{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <div className="checkbox-group">
        {options.map((option, index) => {
          const optionValue = isObjectOptions ? ((option as any).code || (option as any).value || (option as any).label) : option as string;
          const optionLabel = isObjectOptions ? (option as any).label : option as string;
          
          // Determine if this checkbox should be disabled
          let isDisabled = false;
          if (optionValue === 'NOT_A_MEMBER') {
            // Disable "Not a member" if any actual membership is selected
            isDisabled = values.some((v) => v !== 'NOT_A_MEMBER' && v !== optionValue);
          } else {
            // Disable other options if "Not a member" is selected
            isDisabled = values.includes('NOT_A_MEMBER');
          }
          
          return (
            <Form.Check
              key={index}
              type="checkbox"
              id={`${id}-${index}`}
              label={optionLabel}
              checked={values.includes(optionValue)}
              onChange={(e) => handleCheckboxChange(optionValue, e.target.checked)}
              disabled={isDisabled}
              className="darker-checkbox"
            />
          );
        })}
      </div>
    </Form.Group>
  );
};

export default CheckboxGroup;
