import { useState, useCallback, useEffect } from 'react';
import { surveyService, type SurveyStep, type SurveyQuestion, type ChoiceOption } from '../services/formService';
import { locationService, type District, type RevenueDivision, type Mandal, type Village } from '../services/locationService';
import { useLanguage } from '../context/LanguageContext';

interface FormState {
  [key: string]: string | string[];
}

export const useProgressiveForm = () => {
  const { language } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormState>({});
  const [referenceId, setReferenceId] = useState<string>('');
  const [steps, setSteps] = useState<SurveyStep[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({
    districts: [],
    revenueDivisions: [],
    mandals: [],
    villages: [],
  });

  // Load survey schema and choices on mount or when language changes
  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        setLoading(true);
        const [schemaSteps, districts] = await Promise.all([
          surveyService.getSurveySchema(language),
          locationService.getDistricts(language),
        ]);

        // console.log('Loaded schema steps:', schemaSteps);
        // console.log('Total steps from backend:', schemaSteps.length);

        // Add location step as first step with translated labels
        const locationStep: SurveyStep = {
          step_id: 'LOCATION',
          title: language === 'te' ? 'ప్రాంత సమాచారం' : 'Location Information',
          step_number: 0,
          total_steps: schemaSteps.length + 1,
          questions: [
            {
              question_id: 'district',
              label: language === 'te' ? 'జిల్లా' : 'District',
              input_type: 'dropdown',
              required: true,
              options: [],
              rowGroup: 'location-row-1',
            },
            {
              question_id: 'revenueDivision',
              label: language === 'te' ? 'రెవిన్యూ విభాగం' : 'Revenue Division',
              input_type: 'dropdown',
              required: true,
              options: [],
              rowGroup: 'location-row-1',
              dependsOn: 'district',
            },
            {
              question_id: 'mandal',
              label: language === 'te' ? 'మండలం' : 'Mandal',
              input_type: 'dropdown',
              required: true,
              options: [],
              rowGroup: 'location-row-2',
              dependsOn: 'revenueDivision',
            },
            {
              question_id: 'village',
              label: language === 'te' ? 'గ్రామం/పట్టణం' : 'Village/Town',
              input_type: 'dropdown',
              required: true,
              options: [],
              rowGroup: 'location-row-2',
              dependsOn: 'mandal',
            },
          ],
        };

        // Update total_steps for all steps
        const updatedSteps = schemaSteps.map((step, idx) => ({
          ...step,
          step_number: idx + 1,
          total_steps: schemaSteps.length + 1,
        }));

        // console.log('All steps after adding location:', [locationStep, ...updatedSteps]);
        
        // Log each step's questions and their options
        // updatedSteps.forEach(step => {
        //   console.log(`Step ${step.step_id}:`, step.questions.map(q => ({
        //     id: q.question_id,
        //     hasOptions: q.options?.length > 0,
        //     optionsCount: q.options?.length || 0,
        //     visible_when: q.visible_when
        //   })));
        // });

        setSteps([locationStep, ...updatedSteps]);
        setDynamicOptions((prev) => ({
          ...prev,
          districts: districts.map((d: District) => ({
            code: d.id.toString(),
            label: d.name,
          })),
        }));
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to load survey data:', err);
        setError(err.message || 'Failed to load survey');
        setLoading(false);
      }
    };

    loadSurveyData();
  }, [language]);

  // Load revenue divisions when district changes
  useEffect(() => {
    const loadRevenueDivisions = async () => {
      const districtId = formData['district'] as string;
      if (districtId) {
        const divisions = await locationService.getRevenueDivisions(parseInt(districtId), language);
        setDynamicOptions((prev) => ({
          ...prev,
          revenueDivisions: divisions.map((d: RevenueDivision) => ({
            code: d.id.toString(),
            label: d.division_name,
          })),
        }));
      } else {
        setDynamicOptions((prev) => ({ ...prev, revenueDivisions: [], mandals: [], villages: [] }));
      }
    };
    loadRevenueDivisions();
  }, [formData['district'], language]);

  // Load mandals when revenue division changes
  useEffect(() => {
    const loadMandals = async () => {
      const divisionId = formData['revenueDivision'] as string;
      if (divisionId) {
        const mandals = await locationService.getMandals(parseInt(divisionId), language);
        setDynamicOptions((prev) => ({
          ...prev,
          mandals: mandals.map((m: Mandal) => ({
            code: m.id.toString(),
            label: m.mandal_name,
          })),
        }));
      } else {
        setDynamicOptions((prev) => ({ ...prev, mandals: [], villages: [] }));
      }
    };
    loadMandals();
  }, [formData['revenueDivision'], language]);

  // Load villages when mandal changes
  useEffect(() => {
    const loadVillages = async () => {
      const mandalId = formData['mandal'] as string;
      if (mandalId) {
        const villages = await locationService.getVillages(parseInt(mandalId), language);
        setDynamicOptions((prev) => ({
          ...prev,
          villages: villages.map((v: Village) => ({
            code: v.id.toString(),
            label: v.village_name,
          })),
        }));
      } else {
        setDynamicOptions((prev) => ({ ...prev, villages: [] }));
      }
    };
    loadVillages();
  }, [formData['mandal'], language]);

  // Get current step
  const getCurrentStep = useCallback((): SurveyStep | undefined => {
    return steps[currentStepIndex];
  }, [currentStepIndex, steps]);

  // Check if a question should be visible based on conditions
  const isQuestionVisible = useCallback(
    (question: SurveyQuestion): boolean => {
      if (!question.visible_when) return true;

      for (const [questionId, allowedValues] of Object.entries(question.visible_when)) {
        const currentValue = formData[questionId];
        if (!allowedValues.includes(currentValue as string)) {
          return false;
        }
      }
      return true;
    },
    [formData]
  );

  // Get visible questions for current step
  const getVisibleQuestions = useCallback((): SurveyQuestion[] => {
    const currentStep = getCurrentStep();
    if (!currentStep || !currentStep.questions) return [];

    const visibleQuestions = currentStep.questions.filter(isQuestionVisible);
    // console.log(`Step ${currentStep.step_id} - Total questions: ${currentStep.questions.length}, Visible: ${visibleQuestions.length}`);
    // console.log('Form data for visibility check:', formData);
    // currentStep.questions.forEach(q => {
    //   const visible = isQuestionVisible(q);
    //   console.log(`  - ${q.question_id}: ${visible ? 'VISIBLE' : 'HIDDEN'}`, q.visible_when || 'no conditions');
    // });
    
    return visibleQuestions;
  }, [getCurrentStep, isQuestionVisible, formData]);

  // Get options for a field
  const getFieldOptions = useCallback(
    (question: SurveyQuestion): ChoiceOption[] => {
      const questionId = question.question_id;

      // Check if it's a location field
      if (questionId === 'district') {
        return dynamicOptions.districts;
      }
      if (questionId === 'revenueDivision') {
        return dynamicOptions.revenueDivisions;
      }
      if (questionId === 'mandal') {
        return dynamicOptions.mandals;
      }
      if (questionId === 'village') {
        return dynamicOptions.villages;
      }

      // Return options from question
      return question.options || [];
    },
    [dynamicOptions]
  );

  // Update form field value
  const updateField = useCallback((fieldId: string, value: string | string[]) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [fieldId]: value,
      };

      // Clear dependent fields when parent changes
      if (fieldId === 'district') {
        delete newData['revenueDivision'];
        delete newData['mandal'];
        delete newData['village'];
      } else if (fieldId === 'revenueDivision') {
        delete newData['mandal'];
        delete newData['village'];
      } else if (fieldId === 'mandal') {
        delete newData['village'];
      }

      return newData;
    });
  }, []);

  // Check if current step can proceed
  const canProceed = useCallback((): boolean => {
    const visibleQuestions = getVisibleQuestions();
    const requiredQuestions = visibleQuestions.filter((q) => q.required);

    return requiredQuestions.every((question) => {
      const value = formData[question.question_id];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== '';
    });
  }, [formData, getVisibleQuestions]);

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    let nextIndex = currentStepIndex + 1;
    
    // Skip steps with no visible questions
    while (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      const nextStepVisibleQuestions = nextStep.questions?.filter((q) => {
        if (!q.visible_when) return true;
        for (const [questionId, allowedValues] of Object.entries(q.visible_when)) {
          const currentValue = formData[questionId];
          if (!allowedValues.includes(currentValue as string)) {
            return false;
          }
        }
        return true;
      }) || [];
      
      if (nextStepVisibleQuestions.length > 0) {
        break;
      }
      
      // console.log(`Skipping step ${nextStep.step_id} - no visible questions`);
      nextIndex++;
    }
    
    if (nextIndex < steps.length) {
      // console.log(`Moving to step ${steps[nextIndex].step_id}`);
      setCurrentStepIndex(nextIndex);
    } 
  }, [currentStepIndex, steps, formData]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    let prevIndex = currentStepIndex - 1;
    
    // Skip steps with no visible questions
    while (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      const prevStepVisibleQuestions = prevStep.questions?.filter((q) => {
        if (!q.visible_when) return true;
        for (const [questionId, allowedValues] of Object.entries(q.visible_when)) {
          const currentValue = formData[questionId];
          if (!allowedValues.includes(currentValue as string)) {
            return false;
          }
        }
        return true;
      }) || [];
      
      if (prevStepVisibleQuestions.length > 0) {
        break;
      }
      
      // console.log(`Skipping step ${prevStep.step_id} backwards - no visible questions`);
      prevIndex--;
    }
    
    if (prevIndex >= 0) {
      // console.log(`Moving back to step ${steps[prevIndex].step_id}`);
      setCurrentStepIndex(prevIndex);
    }
  }, [currentStepIndex, steps, formData]);

  // Submit form
  const submitForm = useCallback(async (mobileNumber: string) => {
    try {
      // Prepare answers (exclude location fields and mobile)
      const answers = Object.entries(formData)
        .filter(([key]) => !['district', 'revenueDivision', 'mandal', 'village', 'mobile'].includes(key))
        .map(([question_id, value]) => ({
          question_id,
          value,
        }));

      const submissionData = {
        district: parseInt(formData['district'] as string),
        division: parseInt(formData['revenueDivision'] as string),
        mandal: parseInt(formData['mandal'] as string),
        village: parseInt(formData['village'] as string),
        mobile_number: mobileNumber,
        answers,
      };

      const result = await surveyService.submitSurvey(submissionData);
      setReferenceId(result.reference_id);
      return result.reference_id;
    } catch (error: any) {
      console.error('Submission failed:', error);
      throw error;
    }
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setCurrentStepIndex(0);
    setFormData({});
    setReferenceId('');
  }, []);

  return {
    currentStep: getCurrentStep(),
    formData,
    updateField,
    canProceed,
    goToNextStep,
    goToPreviousStep,
    submitForm,
    resetForm,
    getVisibleQuestions,
    getFieldOptions,
    isQuestionVisible,
    referenceId,
    loading,
    error,
    allSteps: steps,
    currentStepIndex,
  };
};
