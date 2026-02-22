import React, { useEffect } from 'react';
import { Container, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useFormContext } from '../../context/FormContext';
import { useProgressiveForm } from '../../hooks/useProgressiveForm';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../constants/translations';

interface ReviewPageProps {
  onEdit: () => void;
  onSubmit: () => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ onEdit, onSubmit }) => {
  const { language } = useLanguage();
  const { formData } = useFormContext();
  const { allSteps, getFieldOptions, updateField } = useProgressiveForm();
  useEffect(() => {
    const keys = ['district', 'revenueDivision', 'mandal', 'village'] as const;
  
    keys.forEach((key) => {
      const value = formData[key];
      if (typeof value === 'string' && value) {
        updateField(key, value);
      }
    });
  }, [formData, updateField]);

  // Get all questions from all steps (including location)
  const getAllQuestions = () => {
    const allQuestions: any[] = [];
    allSteps.forEach((step) => {
      if (step.questions) {
        step.questions.forEach((question) => {
          allQuestions.push({
            ...question,
            stepTitle: step.title,
          });
        });
      }
    });
    return allQuestions;
  };

// Get option label from question's options or value itself
const getOptionLabel = (question: any, value: string): string => {
  // Prefer question.options, but fall back to dynamic options from the hook
  const options =
    question.options && question.options.length > 0
      ? question.options
      : getFieldOptions(question);
      {console.log(options,"*************")}

  if (!options || options.length === 0) return value;

  // Find the option that matches the value (can be code or value field)
  const option = options.find(
    (opt: any) => opt.code === value || opt.value === value || opt.label === value
  );
  return option ? option.label : value;
};

  // Format the answer for display
  const formatAnswer = (question: any, value: any): string | React.ReactElement => {
    if (!value) return t('notAnswered', language);

    if (Array.isArray(value)) {
      if (value.length === 0) return t('notAnswered', language);
      return (
        <div className="d-flex flex-wrap gap-2">
          {value.map((val, index) => (
            <Badge key={index} bg="primary" className="px-3 py-2">
              {getOptionLabel(question, val)}
            </Badge>
          ))}
        </div>
      );
    }

    return getOptionLabel(question, value);
  };

  // Get only answered questions
  const getAnsweredQuestions = () => {
    const allQuestions = getAllQuestions();
    return allQuestions.filter((question) => {
      const value = formData[question.question_id];
      return value !== undefined && value !== null && value !== '' && 
             (!Array.isArray(value) || value.length > 0);
    });
  };

  const answeredQuestions = getAnsweredQuestions();

  // Group questions by step
  const groupedQuestions = answeredQuestions.reduce((acc: any, question) => {
    const stepTitle = question.stepTitle;
    if (!acc[stepTitle]) {
      acc[stepTitle] = [];
    }
    acc[stepTitle].push(question);
    return acc;
  }, {});

  console.log('Review Page - All Steps:', allSteps);
  console.log('Review Page - Form Data:', formData);
  console.log('Review Page - Answered Questions:', answeredQuestions);
  console.log('Review Page - Grouped Questions:', groupedQuestions);
  

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{t('reviewTitle', language)}</h4>
          <p className="mb-0 small mt-2">{t('reviewSubtitle', language)}</p>
        </Card.Header>

        <Card.Body className="p-4 p-md-5">
          {Object.keys(groupedQuestions).length === 0 ? (
            <div className="text-center text-muted py-5">
              <p>No responses to review yet.</p>
            </div>
          ) : (
            <div className="review-sections">
              {Object.entries(groupedQuestions).map(([stepTitle, questions]: [string, any]) => (
                <div key={stepTitle} className="mb-5">
                  <h5 className="mb-4 pb-2 border-bottom text-primary">
                    {stepTitle}
                  </h5>
                  <Row className="g-4">
                    {questions.map((question: any) =>{
                      console.log(question);
                      return(
                      <Col key={question.question_id} md={12}>
                        <div className="review-item p-3 bg-light rounded">
                          <div className="mb-2">
                            <strong className="text-secondary d-block mb-2">
                              {question.label}
                            </strong>
                            <div className="ms-3">
                              {formatAnswer(question, formData[question.question_id])}
                            </div>
                          </div>
                        </div>
                      </Col>
                    )})}
                  </Row>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
            <Button variant="outline-secondary" size="lg" onClick={onEdit}>
              <i className="bi bi-pencil me-2"></i>
              {t('edit', language)}
            </Button>
            <Button variant="primary" size="lg" onClick={onSubmit}>
              {t('submitResponse', language)}
              <i className="bi bi-check-lg ms-2"></i>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
  
};


export default ReviewPage;
