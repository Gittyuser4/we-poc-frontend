import React, { createContext, useContext, useState,} from 'react';
import { type ReactNode } from 'react';
interface FormState {
  [key: string]: string | string[];
}

interface FormContextType {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  referenceId: string;
  setReferenceId: React.Dispatch<React.SetStateAction<string>>;
  showReview: boolean;
  setShowReview: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormState>({});
  const [referenceId, setReferenceId] = useState<string>('');
  const [showReview, setShowReview] = useState<boolean>(false);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        referenceId,
        setReferenceId,
        showReview,
        setShowReview,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
