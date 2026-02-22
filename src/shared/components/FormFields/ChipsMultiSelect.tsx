import React from 'react';
import { Form } from 'react-bootstrap';

interface ChipsMultiSelectProps {
  id: string;
  label: string;
  values: string[];
  options: string[] | Array<{ code?: string; label: string; value?: string }>;
  onChange: (values: string[]) => void;
  required?: boolean;
}

const ChipsMultiSelect: React.FC<ChipsMultiSelectProps> = ({
  // id,
  label,
  values,
  options,
  onChange,
  required = false,
}) => {
  const isObjectOptions = Array.isArray(options) && options.length > 0 && typeof options[0] === 'object';

  const toggleChip = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <Form.Group className="mb-4 question-container">
      <Form.Label className="fw-bold">{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <div className="chips-container">
        {options.map((option, index) => {
          const optionValue = isObjectOptions ? ((option as any).code || (option as any).value || (option as any).label) : option as string;
          const optionLabel = isObjectOptions ? (option as any).label : option as string;
          const isActive = values.includes(optionValue);
          
          return (
            <button
              key={index}
              type="button"
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => toggleChip(optionValue)}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </Form.Group>
  );
};

export default ChipsMultiSelect;
