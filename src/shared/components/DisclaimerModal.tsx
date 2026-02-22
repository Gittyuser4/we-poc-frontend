import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../constants/translations';

interface DisclaimerModalProps {
  show: boolean;
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ show, onAccept }) => {
  const { language } = useLanguage();
  
  return (
    <Modal show={show} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('disclaimerTitle', language)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="text-primary mb-3">{t('surveyInfoHeading', language)}</h5>
          <p>
            {t('surveyInfoText', language)}
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-primary mb-3">{t('privacyHeading', language)}</h5>
          <ul className="text-muted">
            <li>{t('privacyPoint1', language)}</li>
            <li>{t('privacyPoint2', language)}</li>
            <li>{t('privacyPoint3', language)}</li>
            <li>{t('privacyPoint4', language)}</li>
            <li>{t('privacyPoint5', language)}</li>
            <li>{t('privacyPoint6', language)}</li>
          </ul>
        </div>

        <div className="alert alert-info">
          <strong>{t('disclaimerNote', language)}</strong> {t('disclaimerAcknowledge', language)}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onAccept} size="lg" className="px-5">
          {t('disclaimerButton', language)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisclaimerModal;
