import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaUser, FaUserGraduate, FaUserTie, FaCity, FaHome, FaGraduationCap, FaBriefcase, FaLightbulb, FaWheelchair, FaUserSlash } from 'react-icons/fa';
import { GiFarmer, GiFarmTractor } from 'react-icons/gi';

interface RadioTilesProps {
  id: string;
  label: string;
  value: string;
  options: string[] | Array<{ code?: string; label: string; value?: string; icon?: string }>;
  onChange: (value: string) => void;
  required?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  FaUser,
  FaUserGraduate,
  FaUserTie,
  FaCity,
  GiFarmer,
  FaHome,
  FaGraduationCap,
  FaBriefcase,
  FaLightbulb,
  GiFarmTractor,
  FaWheelchair,
  FaUserSlash,
};

const RadioTiles: React.FC<RadioTilesProps> = ({
  id,
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
          const iconName = isObjectOptions ? (option as any).icon : undefined;
          const IconComponent = iconName ? iconMap[iconName] : undefined;
          
          return (
            <Col key={index} xs={12} sm={6} md={4}>
              <div
                className={`radio-tile ${value === optionValue ? 'active' : ''} ${IconComponent ? 'has-icon' : ''}`}
                onClick={() => onChange(optionValue)}
              >
                {IconComponent && (
                  <div className="radio-tile-icon mb-2">
                    <IconComponent size={32} />
                  </div>
                )}
                <Form.Check
                  type="radio"
                  id={`${id}-${index}`}
                  name={id}
                  label={optionLabel}
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={(e) => onChange(e.target.value)}
                  required={required}
                  className={IconComponent ? 'radio-with-icon' : ''}
                />
              </div>
            </Col>
          );
        })}
      </Row>
    </Form.Group>
  );
};

export default RadioTiles;
