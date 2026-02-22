/**
 * Translation constants for all UI strings
 * Backend handles question/option translations via API
 * This file handles static UI text only
 */

export const translations = {
  en: {
    // Navigation & Buttons
    continue: 'Continue',
    back: 'Back',
    submit: 'Submit Survey',
    submitting: 'Submitting...',
    cancel: 'Cancel',
    edit: 'Edit Responses',
    submitResponse: 'Submit Response',
    tryDifferent: 'Try Different Number',
    verifying: 'Verifying...',
    
    // Progress & Headers
    progress: 'Progress',
    reviewTitle: 'Review Your Responses',
    reviewSubtitle: 'Please review all your answers before submitting',
    
    // Mobile Number Field
    mobileNumber: 'Mobile Number',
    mobileNumberRequired: 'Mobile Number ',
    enterMobile: 'Enter 10-digit mobile number',
    invalidMobile: 'Please enter a valid 10-digit mobile number',
    mobileHelper: 'Your mobile number is used only to prevent duplicate submissions',
    
    // Form Fields
    notAnswered: 'Not answered',
    selectOption: 'Select an option',
    required: '*',
    
    // Disclaimer Modal
    disclaimerTitle: 'Women Empowerment Survey - Important Information',
    surveyInfoHeading: '📋 Survey Information',
    surveyInfoText: 'Welcome! This survey helps us understand the needs and aspirations of women in our community to design better support programs.',
    privacyHeading: '🔒 Privacy & Data Collection',
    privacyPoint1: 'No personal identification information is collected',
    privacyPoint2: 'Your responses are completely anonymous',
    privacyPoint3: 'Only your mobile number is collected to prevent duplicate submissions',
    privacyPoint4: 'Data is used solely for women empowerment initiatives',
    privacyPoint5: 'We do not share your information with any third parties',
    privacyPoint6: 'Your data is securely stored and protected',
    disclaimerNote: 'Note:',
    disclaimerAcknowledge: 'By proceeding, you acknowledge that you understand the survey purpose and consent to the data collection practices described above.',
    disclaimerButton: 'I Understand - Proceed to Survey',
    
    // Consent Modal
    consentTitle: 'Data Privacy Acknowledgment',
    consentHeading: 'Your Privacy Matters',
    consentIntro: 'We want to assure you that:',
    consentCheck: 'I acknowledge that my responses will be used only for program planning and will not be shared with third parties',
    
    // Already Submitted Screen
    alreadySubmittedTitle: 'Response Already Submitted',
    alreadySubmittedMessage: 'A response has already been submitted from this mobile number.',
    alreadySubmittedNote: 'Each mobile number can submit the survey only once to ensure data integrity.',
    thankYouMessage: 'Thank you for your participation! 🙏',
    
    // Thank You Page
    thankYouTitle: 'Thank You!',
    thankYouText: 'Your response has been recorded.',
    thankYouNoDetails: 'No personal details were collected.',
    referenceIdLabel: 'Your Reference ID:',
    
    // Errors
    errorLoading: 'Failed to load survey. Please try again.',
    errorSubmitting: 'Failed to submit survey. Please try again.',
    errorVerifying: 'Failed to verify mobile number. Please try again.',
  },
  te: {
    // Navigation & Buttons
    continue: 'కొనసాగించు',
    back: 'మునుపటి పేజీ',
    submit: 'సర్వే సమర్పించండి',
    submitting: 'సమర్పిస్తోంది...',
    cancel: 'రద్దు చేయి',
    edit: 'సమాధానాలను సవరించు',
    submitResponse: 'సమాధానం సమర్పించండి',
    tryDifferent: 'వేరే నంబర్ ప్రయత్నించండి',
    verifying: 'ధృవీకరిస్తోంది...',
    
    // Progress & Headers
    progress: 'పురోగతి',
    reviewTitle: 'మీ సమాధానాలను సమీక్షించండి',
    reviewSubtitle: 'దయచేసి సమర్పించే ముందు మీ అన్ని సమాధానాలను సమీక్షించండి',
    
    // Mobile Number Field
    mobileNumber: 'మొబైల్ నంబర్',
    mobileNumberRequired: 'మొబైల్ నంబర్',
    enterMobile: '10-అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
    invalidMobile: 'దయచేసి చెల్లుబాటు అయ్యే 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి',
    mobileHelper: 'పునరావృత దరఖాస్తులను నివారించడానికి మాత్రమే మీ మొబైల్ నంబర్ ఉపయోగించబడుతుంది.',
    
    // Form Fields
    notAnswered: 'సమాధానం లేదు',
    selectOption: 'ఒక ఎంపికను ఎంచుకోండి',
    required: '*',
    
    // Disclaimer Modal
    disclaimerTitle: 'మహిళా సాధికారత సర్వే - ముఖ్యమైన సమాచారం',
    surveyInfoHeading: '📋 సర్వే సమాచారం',
    surveyInfoText: 'స్వాగతం! మంచి మద్దతు కార్యక్రమాలను రూపొందించడానికి మా సమాజంలోని మహిళల అవసరాలు మరియు ఆకాంక్షలను అర్థం చేసుకోవడానికి ఈ సర్వే మాకు సహాయం చేస్తుంది.',
    privacyHeading: '🔒 గోప్యత & డేటా సేకరణ',
    privacyPoint1: 'వ్యక్తిగత గుర్తింపు సమాచారం సేకరించబడదు',
    privacyPoint2: 'మీ ప్రతిస్పందనలు పూర్తిగా అనామకంగా ఉంటాయి',
    privacyPoint3: 'డూప్లికేట్ సమర్పణలను నివారించడానికి మీ మొబైల్ నంబర్ మాత్రమే సేకరించబడుతుంది',
    privacyPoint4: 'డేటా మహిళా సాధికారత కార్యక్రమాల కోసం మాత్రమే ఉపయోగించబడుతుంది',
    privacyPoint5: 'మేము మీ సమాచారాన్ని మూడవ పక్షాలతో భాగస్వామ్యం చేయము',
    privacyPoint6: 'మీ డేటా సురక్షితంగా నిల్వ చేయబడి రక్షించబడుతుంది',
    disclaimerNote: 'గమనిక:',
    disclaimerAcknowledge: 'కొనసాగడం ద్వారా, మీరు సర్వే ఉద్దేశ్యాన్ని అర్థం చేసుకున్నారని మరియు పైన వివరించిన డేటా సేకరణ పద్ధతులకు సమ్మతిస్తున్నారని మీరు అంగీకరిస్తున్నారు.',
    disclaimerButton: 'నేను అర్థం చేసుకున్నాను - సర్వేకు కొనసాగండి',
    
    // Consent Modal
    consentTitle: 'డేటా గోప్యత అంగీకారం',
    consentHeading: 'మీ గోప్యత ముఖ్యం',
    consentIntro: 'మేము మీకు హామీ ఇవ్వాలనుకుంటున్నాం:',
    consentCheck: 'నా ప్రతిస్పందనలు కార్యక్రమ ప్రణాళిక కోసం మాత్రమే ఉపయోగించబడతాయని మరియు మూడవ పక్షాలతో భాగస్వామ్యం చేయబడవని నేను అంగీకరిస్తున్నాను',
    
    // Already Submitted Screen
    alreadySubmittedTitle: 'ప్రతిస్పందన ఇప్పటికే సమర్పించబడింది',
    alreadySubmittedMessage: 'ఈ మొబైల్ నంబర్ నుండి ఇప్పటికే ప్రతిస్పందన సమర్పించబడింది.',
    alreadySubmittedNote: 'డేటా సమగ్రతను నిర్ధారించడానికి ప్రతి మొబైల్ నంబర్ ఒకసారి మాత్రమే సర్వే సమర్పించగలదు.',
    thankYouMessage: 'మీ భాగస్వామ్యానికి ధన్యవాదాలు! 🙏',
    
    // Thank You Page
    thankYouTitle: 'ధన్యవాదాలు!',
    thankYouText: 'మీ ప్రతిస్పందన రికార్డ్ చేయబడింది.',
    thankYouNoDetails: 'వ్యక్తిగత వివరాలు సేకరించబడలేదు.',
    referenceIdLabel: 'మీ రిఫరెన్స్ ID:',
    
    // Errors
    errorLoading: 'సర్వే లోడ్ చేయడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    errorSubmitting: 'సర్వే సమర్పించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    errorVerifying: 'మొబైల్ నంబర్‌ను ధృవీకరించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
  }
};

export type TranslationKey = keyof typeof translations.en;

/**
 * Get translated text for a given key and language
 */
export const t = (key: TranslationKey, language: 'en' | 'te' = 'en'): string => {
  return translations[language][key] || translations.en[key] || key;
};
