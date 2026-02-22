/**
 * Survey Service - Backend API Integration
 * 
 * Handles all API calls for survey schema, choices, and submission
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface SurveyQuestion {
  question_id: string;
  label: string;
  input_type: 'dropdown' | 'radio' | 'checkbox' | 'chips' | 'cards' | 'radioTiles';
  required: boolean;
  visible_when?: Record<string, string[]>;
  options: Array<{ code: string; label: string }>;
  rowGroup?: string;
  dependsOn?: string;
}

export interface SurveyStep {
  step_id: string;
  title: string;
  step_number: number;
  total_steps: number;
  questions: SurveyQuestion[];
}

export interface ChoiceOption {
  code: string;
  label: string;
  icon?: string;
}

export interface ChoiceCategory {
  code: string;
  name: string;
  options: ChoiceOption[];
}

export interface SurveyAnswer {
  question_id: string;
  value: string | string[];
}

export interface SurveySubmissionRequest {
  district: number;
  division: number;
  mandal: number;
  village: number;
  mobile_number: string;
  answers: SurveyAnswer[];
}

export interface SurveySubmissionResponse {
  reference_id: string;
  created_at: string;
}

export interface MobileCheckResponse {
  exists: boolean;
  message: string;
}

class SurveyService {
  /**
   * Check if mobile number already exists
   */
  async checkMobileNumber(mobileNumber: string): Promise<MobileCheckResponse> {
    try {
      // console.log('Checking mobile number:', mobileNumber);
      const response = await fetch(`${API_BASE_URL}/api/survey/check-mobile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Mobile check API error:', errorText);
        throw new Error(`Failed to check mobile number: ${response.statusText}`);
      }

      const result: MobileCheckResponse = await response.json();
      // console.log('Mobile check result:', result);
      return result;
    } catch (error) {
      console.error('Error checking mobile number:', error);
      throw error;
    }
  }
  /**
   * Fetch survey schema from backend
   */
  async getSurveySchema(language: 'en' | 'te' = 'en'): Promise<SurveyStep[]> {
    try {
      const url = `${API_BASE_URL}/api/survey/schema/?lang=${language}`;
      console.log('Fetching survey schema from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Survey schema API error:', errorText);
        throw new Error(`Failed to fetch survey schema: ${response.statusText}`);
      }

      const steps: SurveyStep[] = await response.json();
      // console.log('Survey schema loaded:', steps);
      return steps;
    } catch (error) {
      console.error('Error fetching survey schema:', error);
      throw error;
    }
  }

  /**
   * Fetch all choice categories
   */
  async getChoiceCategories(language: 'en' | 'te' = 'en'): Promise<ChoiceCategory[]> {
    try {
      const url = `${API_BASE_URL}/api/survey/choices/?lang=${language}`;
      console.log('Fetching choice categories from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Choice categories API error:', errorText);
        throw new Error(`Failed to fetch choice categories: ${response.statusText}`);
      }

      const categories: ChoiceCategory[] = await response.json();
      // console.log('Choice categories loaded:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching choice categories:', error);
      throw error;
    }
  }

  /**
   * Submit survey to backend
   */
  async submitSurvey(data: SurveySubmissionRequest): Promise<SurveySubmissionResponse> {
    try {
      console.log('Submitting survey:', data);
      const response = await fetch(`${API_BASE_URL}/api/survey/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Survey submission error:', errorData);
        throw new Error(errorData.detail || 'Failed to submit survey');
      }

      const result: SurveySubmissionResponse = await response.json();
      // console.log('Survey submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  }
}

export const surveyService = new SurveyService();

// Legacy exports for backward compatibility (keeping old code below)
 

interface ApiResponse {
  success: boolean;
  referenceId: string;
  message?: string;
}

/**
 * Submit form data to the API
 * TODO: Replace with actual API endpoint
 */
export const submitFormData = async (
  _formData: Record<string, string | string[]>
): Promise<ApiResponse> => {
  // Placeholder for API call
  // Example implementation:
  /*
  try {
    const response = await fetch('/api/survey/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    const data = await response.json();
    return {
      success: true,
      referenceId: data.referenceId,
      message: data.message,
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      referenceId: '',
      message: 'Failed to submit form. Please try again.',
    };
  }
  */

  // Mock response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        referenceId: generateMockReferenceId(),
        message: 'Form submitted successfully',
      });
    }, 500);
  });
};

/**
 * Fetch form options from API
 * TODO: Replace with actual API endpoint
 */
export const fetchFormOptions = async (): Promise<Record<string, any>> => {
  // Placeholder for API call
  // Example implementation:
  /*
  try {
    const response = await fetch('/api/survey/options');
    
    if (!response.ok) {
      throw new Error('Failed to fetch form options');
    }

    const data = await response.json();
    return data.options;
  } catch (error) {
    console.error('Error fetching form options:', error);
    // Return empty object or fallback to local data
    return {};
  }
  */

  // Mock response - currently using local JSON files
  return Promise.resolve({});
};

/**
 * Fetch form schema from API
 * TODO: Replace with actual API endpoint
 */
export const fetchFormSchema = async (): Promise<any> => {
  // Placeholder for API call
  // Example implementation:
  /*
  try {
    const response = await fetch('/api/survey/schema');
    
    if (!response.ok) {
      throw new Error('Failed to fetch form schema');
    }

    const data = await response.json();
    return data.schema;
  } catch (error) {
    console.error('Error fetching form schema:', error);
    return null;
  }
  */

  // Mock response - currently using local JSON files
  return Promise.resolve(null);
};

/**
 * Helper function to generate mock reference ID
 * This can be removed when actual API provides the ID
 */
const generateMockReferenceId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'WE-';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Validate form data before submission
 * Add any additional validation logic here
 */
export const validateFormData = (
  formData: Record<string, string | string[]>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Add validation rules as needed
  if (!formData.ageGroup) {
    errors.push('Age group is required');
  }

  if (!formData.village) {
    errors.push('Village is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
