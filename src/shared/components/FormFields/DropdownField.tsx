import React from 'react';
import { Form } from 'react-bootstrap';
import { useLanguage } from '../../../context/LanguageContext';
import { t } from '../../../constants/translations';

interface DropdownFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[] | Array<{ value?: string; label: string; code?: string }>;
  onChange: (value: string) => void;
  required?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
}) => {
  const { language } = useLanguage();
  
  // Helper to check if options are objects or strings
  const isObjectOptions = (opts: any[]): opts is Array<{ value?: string; label: string; code?: string }> => {
    return opts.length > 0 && typeof opts[0] === 'object' && ('value' in opts[0] || 'code' in opts[0]);
  };

  return (
    <Form.Group className="mb-4 question-container">
      <Form.Label className="fw-bold">{label} {required && <span className="text-danger">*</span>}</Form.Label>
      <Form.Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="form-select-lg"
      >
        <option value="">{t('selectOption', language)}</option>
        {isObjectOptions(options)
          ? options.map((option) => {
              const optionValue = option.code || option.value || option.label;
              return (
                <option key={optionValue} value={optionValue}>
                  {option.label}
                </option>
              );
            })
          : options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))
        }
      </Form.Select>
    </Form.Group>
  );
};

export default DropdownField;
