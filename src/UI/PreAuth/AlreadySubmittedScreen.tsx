import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../constants/translations';

interface AlreadySubmittedScreenProps {
  mobileNumber?: string;
  onTryAgain?: () => void;
}

const AlreadySubmittedScreen: React.FC<AlreadySubmittedScreenProps> = ({ 
  mobileNumber,
  onTryAgain 
}) => {
  const { language } = useLanguage();
  
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg text-center">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-4" style={{ fontSize: '4rem' }}>
                ✅
              </div>
              
              <h3 className="mb-3">{t('alreadySubmittedTitle', language)}</h3>
              
              <p className="text-muted mb-4">
                {t('alreadySubmittedMessage', language)}
              </p>

              {mobileNumber && (
                <div className="bg-light p-3 rounded mb-4">
                  <small className="text-muted d-block mb-1">{t('mobileNumber', language)}</small>
                  <strong className="text-primary">{mobileNumber}</strong>
                </div>
              )}

              <div className="border-top pt-4 mt-4">
                <p className="text-muted small mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  {t('alreadySubmittedNote', language)}
                </p>
                
                {onTryAgain && (
                  <Button 
                    variant="outline-primary" 
                    onClick={onTryAgain}
                    className="mt-2"
                  >
                    {t('tryDifferent', language)}
                  </Button>
                )}
              </div>

              <div className="mt-4">
                <small className="text-muted">
                  {t('thankYouMessage', language)}
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AlreadySubmittedScreen;
