import React, { useState, useEffect } from 'react';
import { Container, Button, Card, ProgressBar, Form, Alert, Modal } from 'react-bootstrap';
import { FaMobileAlt } from 'react-icons/fa';
import { useProgressiveForm } from '../../hooks/useProgressiveForm';
import { useFormContext } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../constants/translations';
import {
  DropdownField,
  RadioTiles,
  // RadioGroup,
  CheckboxGroup,
  ChipsMultiSelect,
  CardSelect,
} from '../../shared/components/FormFields';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import ReviewPage from './ReviewPage';
import AlreadySubmittedScreen from './AlreadySubmittedScreen';
import DisclaimerModal from '../../shared/components/DisclaimerModal';
import { surveyService as formService } from '../../services/formService';

const SurveyForm: React.FC = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [mobileError, setMobileError] = useState<string | null>(null);
  
  const { setFormData: setContextFormData, referenceId, setReferenceId, showReview, setShowReview } = useFormContext();

  const {
    currentStep,
    formData,
    updateField,
    canProceed,
    goToNextStep,
    goToPreviousStep,
    submitForm,
    // resetForm,
    getVisibleQuestions,
    getFieldOptions,
    loading: dataLoading,
    // error: dataError,
    allSteps,
    currentStepIndex,
  } = useProgressiveForm();

  useEffect(() => {
    // Check if disclaimer was already accepted
    const hasAcceptedDisclaimer = sessionStorage.getItem('disclaimerAccepted');
    
    if (!hasAcceptedDisclaimer) {
      setShowDisclaimer(true);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDisclaimerAccept = () => {
    sessionStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  const checkMobileNumber = async (mobile: string) => {
    setVerifyingMobile(true);
    setMobileError(null);
    
    try {
      const result = await formService.checkMobileNumber(mobile);
      
      if (result.exists) {
        // Mobile number already exists - show already submitted screen
        setAlreadySubmitted(true);
      }
      // If not exists, just continue - user can fill the form
    } catch (error: any) {
      setMobileError(error.message || 'Failed to verify mobile number. Please try again.');
    } finally {
      setVerifyingMobile(false);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setMobileNumber(value);
      setMobileError(null);
      
      // Automatically check when 10 digits are entered
      if (value.length === 10) {
        checkMobileNumber(value);
      }
    }
  };

  const handleTryAgain = () => {
    setAlreadySubmitted(false);
    setMobileNumber('');
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const refId = await submitForm(mobileNumber);
      setReferenceId(refId);
      setShowConsentModal(false);
      setShowReview(false);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sync form data with context
  useEffect(() => {
    setContextFormData(formData);
  }, [formData, setContextFormData]);

  if (isLoading || dataLoading) {
    return <LoadingSpinner />;
  }

  // Show disclaimer modal on first visit
  if (showDisclaimer) {
    return <DisclaimerModal show={showDisclaimer} onAccept={handleDisclaimerAccept} />;
  }

  if (verifyingMobile) {
    return <LoadingSpinner />;
  }

  // Show already submitted screen
  if (alreadySubmitted) {
    return (
      <AlreadySubmittedScreen 
        mobileNumber={mobileNumber || undefined}
        onTryAgain={handleTryAgain}
      />
    );
  }

  // Show review page
  if (showReview) {
    return (
      <>
        <ReviewPage
          onEdit={() => setShowReview(false)}
          onSubmit={() => setShowConsentModal(true)}
        />
        
        {/* Consent Modal */}
        <Modal show={showConsentModal} onHide={() => setShowConsentModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{t('consentTitle', language)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <h6 className="fw-bold mb-3">{t('consentHeading', language)}</h6>
              <p className="text-muted">
                {t('consentIntro', language)}
              </p>
              <ul className="text-muted">
                <li>{t('privacyPoint3', language)}</li>
                <li>{t('privacyPoint1', language)}</li>
                <li>{t('privacyPoint2', language)}</li>
                <li>{t('privacyPoint4', language)}</li>
                <li>{t('privacyPoint5', language)}</li>
                <li>{t('privacyPoint6', language)}</li>
              </ul>
            </div>

            <Form.Group className="mb-3 ">
              <Form.Check
                type="checkbox"
                id="consent-checkbox"
                label={t('consentCheck', language)}
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className='custom-consent-checkbox'
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {setShowConsentModal(false)
              setConsentGiven(false)
            }

            } disabled={submitting}>
              {t('cancel', language)}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={!consentGiven || submitting}
            >
              {submitting ? t('submitting', language) : t('submit', language)}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // Thank you page
  if (referenceId) {
    return (
      <Container className="py-5">
        <Card className="text-center shadow-lg">
          <Card.Body className="py-5">
            <div className="mb-4" style={{ fontSize: '4rem' }}>
              🎉
            </div>
            <Card.Title as="h2" className="mb-4">
              {t('thankYouTitle', language)}
            </Card.Title>
            <Card.Text className="mb-4 text-muted">
              {t('thankYouText', language)}
              <br />
              {t('thankYouNoDetails', language)}
            </Card.Text>
            <div className="bg-light p-4 rounded mb-4">
              <p className="mb-2 text-muted">{t('referenceIdLabel', language)}</p>
              <h3 className="mb-0 text-primary fw-bold">{referenceId}</h3>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!currentStep) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body>
            <p>Loading survey...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const visibleQuestions = getVisibleQuestions();
  // Fixed: Proper progress calculation
  const totalSteps = currentStep.total_steps || allSteps.length;
  const progress = totalSteps > 0 ? ((currentStep.step_number) / totalSteps) * 100 : 0;

  // console.log('Current step:', currentStep.step_id, 'Step number:', currentStep.step_number);
  // console.log('Visible questions count:', visibleQuestions.length);
  // console.log('Visible questions:', visibleQuestions.map(q => q.question_id));

  // Group questions by rowGroup for layout
  const groupedQuestions = visibleQuestions.reduce((groups: Record<string, any[]>, question: any) => {
    const group = question.rowGroup || `individual-${question.question_id}`;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(question);
    return groups;
  }, {});

  const handleContinue = async () => {
    // Check if there are more steps with visible questions
    let hasMoreSteps = false;
    for (let i = currentStepIndex + 1; i < allSteps.length; i++) {
      const nextStep = allSteps[i];
      if (nextStep && nextStep.questions) {
        const nextStepVisibleQuestions = nextStep.questions.filter((q: any) => {
          if (!q.visible_when) return true;
          for (const [questionId, allowedValues] of Object.entries(q.visible_when)) {
            const currentValue = formData[questionId];
            // Fixed: Handle null/undefined values
            if (!currentValue || !(allowedValues as string[]).includes(currentValue as string)) {
              return false;
            }
          }
          return true;
        });
        if (nextStepVisibleQuestions.length > 0) {
          hasMoreSteps = true;
          break;
        }
      }
    }
    
    if (!hasMoreSteps) {
      // Last step (or no more visible steps) - show review
      setShowReview(true);
    } else {
      goToNextStep();
    }
  };

  const renderQuestion = (question: any) => {
    const options = getFieldOptions(question);
    const value = formData[question.question_id];

    // Map backend input types to frontend components
    const inputTypeMap: Record<string, string> = {
      'dropdown': 'dropdown',
      'radio': 'radioTiles',
      'checkbox': 'checkbox',
      'chips': 'chips',
      'cards': 'cards',
    };

    const mappedType = inputTypeMap[question.input_type] || question.input_type;

    try {
      switch (mappedType) {
      case 'dropdown':
        return (
          <DropdownField
            key={question.question_id}
            id={question.question_id}
            label={question.label}
            value={(value as string) || ''}
            options={options}
            onChange={(val) => updateField(question.question_id, val)}
            required={question.required}
          />
        );

      case 'radioTiles':
        return (
          <RadioTiles
            key={question.question_id}
            id={question.question_id}
            label={question.label}
            value={(value as string) || ''}
            options={options}
            onChange={(val) => updateField(question.question_id, val)}
            required={question.required}
          />
        );

      case 'checkbox':
        return (
          <CheckboxGroup
            key={question.question_id}
            id={question.question_id}
            label={question.label}
            values={(value as string[]) || []}
            options={options}
            onChange={(val) => updateField(question.question_id, val)}
            required={question.required}
          />
        );

      case 'chips':
        return (
          <ChipsMultiSelect
            key={question.question_id}
            id={question.question_id}
            label={question.label}
            values={(value as string[]) || []}
            options={options}
            onChange={(val) => updateField(question.question_id, val)}
            required={question.required}
          />
        );

      case 'cards':
        return (
          <CardSelect
            key={question.question_id}
            id={question.question_id}
            label={question.label}
            value={(value as string) || ''}
            options={options}
            onChange={(val) => updateField(question.question_id, val)}
            required={question.required}
          />
        );

      default:
        console.warn(`Unknown input type: ${mappedType} for question ${question.question_id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error rendering question ${question.question_id}:`, error);
      return (
        <Alert variant="warning" key={question.question_id}>
          Unable to render question: {question.label}
        </Alert>
      );
    }
  };

  return (
    <>
      <Container className="py-5">
        <Card className="shadow-lg">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{t('progress', language)}</h5>
            </div>
            <ProgressBar now={progress} variant="light" className="bg-primary" style={{ height: '8px' }} />
          </Card.Header>

          <Card.Body className="p-4 p-md-5">
            <h3 className="mb-4">{currentStep.title}</h3>

            {submitError && (
              <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
                {submitError}
              </Alert>
            )}

            {mobileError && (
              <Alert variant="danger" dismissible onClose={() => setMobileError(null)}>
                {mobileError}
              </Alert>
            )}

            {/* Mobile Number Field - Show only on first step */}
            {currentStep.step_number === 0 && (
              <div className="mb-4 pb-4 border-bottom">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <FaMobileAlt className="me-2" />
                    {t('mobileNumberRequired', language)}
                    <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder={t('enterMobile', language)}
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    maxLength={10}
                    className="form-control-lg"
                    disabled={verifyingMobile}
                    isInvalid={mobileNumber.length > 0 && mobileNumber.length !== 10}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t('invalidMobile', language)}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    {t('mobileHelper', language)}
                  </Form.Text>
                </Form.Group>
              </div>
            )}

            <div className="questions-wrapper">
              {Object.entries(groupedQuestions).map(([groupKey, questions]) => {
                const columnClass = questions.length > 1 ? 'two-columns' : 'single-column';
                return (
                  <div key={groupKey} className={`form-row-group ${columnClass}`}>
                    {questions.map((question: any) => (
                      <div key={question.question_id} className="question-item fade-in">
                        {question.description && (
                          <p className="text-muted small mb-3">{question.description}</p>
                        )}
                        {renderQuestion(question)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between mt-5 pt-3 border-top">
              {currentStep.step_number > 0 && (
                <Button variant="outline-secondary" onClick={goToPreviousStep}>
                  {t('back', language)}
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={
                  !canProceed() || 
                  (currentStep.step_number === 0 && mobileNumber.length !== 10) ||
                  verifyingMobile
                }
                className={currentStep.step_number === 0 ? 'ms-auto' : ''}
                size="lg"
              >
                {verifyingMobile ? t('verifying', language) : t('continue', language)}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Consent Modal */}
      <Modal show={showConsentModal} onHide={() => setShowConsentModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('consentTitle', language)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="fw-bold mb-3">{t('consentHeading', language)}</h6>
            <p className="text-muted">
              {t('consentIntro', language)}
            </p>
            <ul className="text-muted">
              <li>{t('privacyPoint1', language)}</li>
              <li>{t('privacyPoint2', language)}</li>
              <li>{t('privacyPoint4', language)}</li>
              <li>{t('privacyPoint5', language)}</li>
              <li>{t('privacyPoint6', language)}</li>
            </ul>
          </div>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="consent-checkbox"
              label={t('consentCheck', language)}
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className='custom-consent-checkbox'
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConsentModal(false)} disabled={submitting}>
            {t('cancel', language)}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={!consentGiven || submitting}
          >
            {submitting ? t('submitting', language) : t('submit', language)}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SurveyForm;