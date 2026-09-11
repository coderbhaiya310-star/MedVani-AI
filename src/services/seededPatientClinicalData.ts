import { MedicalDocument, StructuredInterviewState, ChatMessage } from '../types';
import {
  createPrescriptionSvg,
  createLabReportSvg,
  createRadiologyScanSvg,
  createDischargeSummarySvg,
} from './sampleMedicalDocs';

// ----------------------------------------------------
// 1. RICH AI NURSE CONVERSATION TRANSCRIPTS & INTERVIEWS
// ----------------------------------------------------

export const SEEDED_INTERVIEWS: Record<string, StructuredInterviewState> = {
  // PATIENT 001 / 101: RAHUL KUMAR
  'PAT-001': {
    interviewId: 'int-pat-001',
    patientId: 'PAT-001',
    language: 'hi',
    chiefComplaint: 'Acute right lower quadrant abdominal pain with nausea',
    symptoms: [
      'Acute right lower quadrant abdominal pain',
      'Nausea (2 episodes of vomiting)',
      'Low-grade fever (100.2°F)',
      'Pain worsening on walking or coughing',
      'Loss of appetite (anorexia)',
    ],
    onset: 'Yesterday evening (~20 hours ago)',
    duration: '1 day',
    severity: '8/10',
    location: 'Right iliac fossa (McBurney point)',
    radiation: 'Started periumbilically, now localized to right lower abdomen',
    character: 'Sharp, stabbing, persistent with colic spasms',
    aggravatingFactors: 'Walking, sudden abdominal pressure, deep breathing, coughing',
    relievingFactors: 'Lying still with right hip flexed',
    associatedSymptoms: ['Nausea', 'Vomiting x2', 'Low-grade fever', 'Mild constipation'],
    medicalHistory: ['Mild childhood asthma (well controlled)', 'Seasonal allergic rhinitis'],
    surgicalHistory: ['No prior abdominal surgeries'],
    medicationHistory: [
      { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'SOS', prescribedFor: 'Fever' },
      { name: 'Antacid Gel', dosage: '10ml', frequency: 'PRN', prescribedFor: 'Gastric uneasiness' },
    ],
    allergies: ['Penicillin (Severe hives, facial swelling and itching)'],
    familyHistory: ['Father has Hypertension; Mother has Osteoarthritis'],
    lifestyle: {
      diet: 'Non-vegetarian, spicy foods common',
      smokingOrTobacco: 'Non-smoker',
      alcohol: 'Social (rare)',
      physicalActivity: 'Sedentary desk job (IT Software Engineer)',
    },
    previousTreatments: ['Took 1 tablet of Paracetamol at home with minimal relief'],
    documentsReferenced: ['doc-p1-usg', 'doc-p1-rx', 'doc-p1-cbc'],
    redFlags: [
      'Severe localized right lower quadrant tenderness with guarding',
      'Fever (100.2°F) accompanied by leukocytosis (TLC 14,800)',
      'Ultrasound confirmed 7.8mm inflamed appendix',
    ],
    missingInformation: ['Urgent surgical consultation evaluation note'],
    conversationTranscript: [
      {
        id: 'msg-p1-1',
        sender: 'ai',
        text: 'नमस्ते राहुल जी! मैं स्वास्थ्या एआई नर्स हूँ। आज आपको क्या शारीरिक परेशानी महसूस हो रही है?',
        translatedText: 'Hello Rahul ji! I am Swasthya AI Nurse. What physical difficulties are you experiencing today?',
        timestamp: '08:31 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p1-2',
        sender: 'patient',
        text: 'नमस्ते सिस्टर, मुझे कल शाम से पेट के निचले दाहिने हिस्से में बहुत तेज़ दर्द हो रहा है और जी मिचला रहा है।',
        translatedText: 'Hello Sister, since yesterday evening I have severe pain in the lower right part of my stomach and feel very nauseous.',
        timestamp: '08:32 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p1-3',
        sender: 'ai',
        text: 'दर्द की तीव्रता 1 से 10 के पैमाने पर कितनी है? क्या चलने या खांसने से दर्द बढ़ता है?',
        translatedText: 'How severe is the pain on a scale of 1 to 10? Does it worsen when walking or coughing?',
        timestamp: '08:33 AM',
        clinicalTag: 'symptom_detail',
      },
      {
        id: 'msg-p1-4',
        sender: 'patient',
        text: 'दर्द लगभग 8 है। जब मैं सीधा खड़ा होता हूँ या चलता हूँ तो बहुत खिंचाव और चुभन होती है। रात को दो बार उल्टी भी हुई।',
        translatedText: 'The pain is about 8. When I stand straight or walk, there is severe pulling and sharp pain. I vomited twice during the night.',
        timestamp: '08:34 AM',
        clinicalTag: 'symptom_detail',
      },
      {
        id: 'msg-p1-5',
        sender: 'ai',
        text: 'क्या आपको बुखार महसूस हो रहा है? और क्या आपको किसी दवा से कोई एलर्जी है?',
        translatedText: 'Do you feel feverish? And do you have any allergies to any medicines?',
        timestamp: '08:35 AM',
        clinicalTag: 'allergy',
      },
      {
        id: 'msg-p1-6',
        sender: 'patient',
        text: 'हाँ, सुबह 100.2°F बुखार था। और मुझे पेनिसिलिन (Penicillin) से बहुत एलर्जी है, पूरे चेहरे पर दाने और सूजन आ जाती है।',
        translatedText: 'Yes, morning temperature was 100.2°F. And I have a severe allergy to Penicillin, causing facial rash and hives.',
        timestamp: '08:36 AM',
        clinicalTag: 'allergy',
      },
      {
        id: 'msg-p1-7',
        sender: 'ai',
        text: 'धन्यवाद राहुल जी। मैंने आपका दर्द (Right Lower Quadrant, 8/10), बुखार, उल्टी और पेनिसिलिन एलर्जी नोट कर ली है। आपके द्वारा अपलोड किया गया अल्ट्रासाउंड और ब्लड टेस्ट रिकॉर्ड डॉक्टर साहब के पास उपलब्ध है।',
        translatedText: 'Thank you Rahul ji. I have recorded your pain (RLQ, 8/10), fever, vomiting, and Penicillin allergy. Your uploaded ultrasound and blood test records are available for the doctor.',
        timestamp: '08:37 AM',
        clinicalTag: 'wrap_up',
      },
    ],
    interviewCompleted: true,
    stage: 'completed',
    updatedAt: '2026-08-29T08:37:00.000Z',
  },

  // PATIENT 002 / 102: ANITA SHARMA / SUNITA DEVI
  'PAT-002': {
    interviewId: 'int-pat-002',
    patientId: 'PAT-002',
    language: 'en',
    chiefComplaint: 'High-grade fever with productive cough & wheezing for 4 days',
    symptoms: [
      'Productive cough with yellowish-green sputum',
      'High-grade intermittent fever (up to 101.8°F)',
      'Right-sided pleuritic chest discomfort',
      'Exertional breathlessness / mild wheeze',
      'General fatigue & body aches',
    ],
    onset: '4 days ago after exposure to rain',
    duration: '4 days',
    severity: '7/10',
    location: 'Right chest, retrosternal',
    radiation: 'No radiation to arm or neck',
    character: 'Deep chest congestion and stabbing sensation during deep inhalation',
    aggravatingFactors: 'Cold air, deep inspiration, physical exertion',
    relievingFactors: 'Steam inhalation, sitting upright with extra pillow',
    associatedSymptoms: ['Chills', 'Decreased appetite', 'Night sweating'],
    medicalHistory: ['Mild seasonal bronchitis', 'Hypertension (managed with Amlodipine 5mg)'],
    surgicalHistory: ['Tubal ligation (2012)'],
    medicationHistory: [
      { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'OD Morning', prescribedFor: 'Hypertension' },
      { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'TDS', prescribedFor: 'Fever' },
    ],
    allergies: ['No known drug allergies (NKDA)'],
    familyHistory: ['Father had chronic asthma; Mother had Type 2 Diabetes'],
    lifestyle: {
      diet: 'Vegetarian diet',
      smokingOrTobacco: 'Never smoked',
      alcohol: 'None',
      physicalActivity: 'Housewife, active household routines',
    },
    previousTreatments: ['Took Paracetamol and cough syrup at home; fever recurred.'],
    documentsReferenced: ['doc-p2-cxr', 'doc-p2-rx', 'doc-p2-crp'],
    redFlags: [
      'Right middle lobe bronchopneumonia consolidation on PA X-Ray',
      'High inflammatory marker (Serum CRP 48.5 mg/L)',
      'Resting SpO2 96% on room air',
    ],
    missingInformation: ['Sputum culture sensitivity final report pending'],
    conversationTranscript: [
      {
        id: 'msg-p2-1',
        sender: 'ai',
        text: 'Hello Anita ji, I am Swasthya AI Nurse. Please share what symptoms brought you to the clinic today.',
        translatedText: 'Hello Anita ji, I am Swasthya AI Nurse. Please share what symptoms brought you to the clinic today.',
        timestamp: '08:46 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p2-2',
        sender: 'patient',
        text: 'I have had high fever, severe chest tightness, and a persistent productive cough with yellowish-green phlegm for the past 4 days.',
        translatedText: 'I have had high fever, severe chest tightness, and a persistent productive cough with yellowish-green phlegm for the past 4 days.',
        timestamp: '08:47 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p2-3',
        sender: 'ai',
        text: 'Are you experiencing any shortness of breath or wheezing? What medications are you currently taking?',
        translatedText: 'Are you experiencing any shortness of breath or wheezing? What medications are you currently taking?',
        timestamp: '08:48 AM',
        clinicalTag: 'symptom_detail',
      },
      {
        id: 'msg-p2-4',
        sender: 'patient',
        text: 'Yes, mild wheezing especially when lying down at night. I take Amlodipine 5mg for blood pressure, and took Paracetamol 650mg for fever.',
        translatedText: 'Yes, mild wheezing especially when lying down at night. I take Amlodipine 5mg for blood pressure, and took Paracetamol 650mg for fever.',
        timestamp: '08:49 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p2-5',
        sender: 'ai',
        text: 'Understood. Do you have any known drug allergies or prior hospital admissions?',
        translatedText: 'Understood. Do you have any known drug allergies or prior hospital admissions?',
        timestamp: '08:50 AM',
        clinicalTag: 'history',
      },
      {
        id: 'msg-p2-6',
        sender: 'patient',
        text: 'No drug allergies that I know of. I uploaded my Chest X-Ray and CRP blood test reports that my son had done yesterday.',
        translatedText: 'No drug allergies that I know of. I uploaded my Chest X-Ray and CRP blood test reports that my son had done yesterday.',
        timestamp: '08:51 AM',
        clinicalTag: 'history',
      },
      {
        id: 'msg-p2-7',
        sender: 'ai',
        text: 'Thank you Anita ji. Your Chest X-Ray showing right middle lobe changes and CRP of 48.5 mg/L are linked to your chart for the doctor.',
        translatedText: 'Thank you Anita ji. Your Chest X-Ray showing right middle lobe changes and CRP of 48.5 mg/L are linked to your chart for the doctor.',
        timestamp: '08:52 AM',
        clinicalTag: 'wrap_up',
      },
    ],
    interviewCompleted: true,
    stage: 'completed',
    updatedAt: '2026-08-29T08:52:00.000Z',
  },

  // PATIENT 003 / 103: RAMESH SINGH / AMITABH SEN
  'PAT-003': {
    interviewId: 'int-pat-003',
    patientId: 'PAT-003',
    language: 'en',
    chiefComplaint: 'Bilateral knee pain, exertional chest heaviness, stopped statin therapy',
    symptoms: [
      'Bilateral knee joint pain & morning stiffness (30 mins)',
      'Difficulty descending stairs and squatting',
      'Mild exertional chest heaviness upon walking > 200 meters',
      'Discontinued Rosuvastatin 20mg 3 months ago due to muscle cramps',
    ],
    onset: 'Knee pain progressive for 2 years; Statin stopped 3 months ago',
    duration: 'Chronic with recent exertional chest tightness',
    severity: '6/10',
    location: 'Bilateral medial knee joints & retrosternal chest',
    radiation: 'Knee pain radiates down medial shin; Chest heaviness stays central',
    character: 'Aching joint grind; Tight band-like pressure in chest upon fast walking',
    aggravatingFactors: 'Stairs, prolonged standing, walking uphill or fast walking',
    relievingFactors: 'Rest, hot fomentation on knees',
    associatedSymptoms: ['Joint crepitus', 'Mild shortness of breath on exertion'],
    medicalHistory: [
      'Coronary Artery Disease (CAD) - Post Primary PCI with DES to Mid-LAD (2021)',
      'Bilateral Knee Osteoarthritis (Grade III)',
      'History of superficial gastric erosion / peptic discomfort on NSAIDs',
    ],
    surgicalHistory: ['Angioplasty & Stenting (DES 3.0 x 24mm to LAD) at Fortis Escorts (2021)'],
    medicationHistory: [
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: 'OD Post-Lunch', prescribedFor: 'CAD Secondary Prevention' },
      { name: 'Metoprolol Succinate 25mg', dosage: '25mg', frequency: 'OD Morning', prescribedFor: 'Cardioprotection' },
      { name: 'Rosuvastatin 20mg', dosage: '20mg', frequency: 'Stopped by self', prescribedFor: 'Lipid Control' },
    ],
    allergies: ['NSAIDs / Diclofenac (Causes severe epigastric burning & dyspepsia)'],
    familyHistory: ['Brother had fatal myocardial infarction at age 58'],
    lifestyle: {
      diet: 'Low-salt vegetarian diet',
      smokingOrTobacco: 'Ex-smoker (Quit 5 years ago after angioplasty)',
      alcohol: 'Occasional social',
      physicalActivity: 'Walks 2 km daily, but curtailed recently due to knee pain',
    },
    previousTreatments: ['Took Ayurvedic joint oil and discontinued statins without consulting doctor.'],
    documentsReferenced: ['doc-p3-discharge', 'doc-p3-lipid', 'doc-p3-xray'],
    redFlags: [
      'CRITICAL SAFETY CONFLICT: Statin abruptly stopped in post-PCI patient with LDL elevated to 168 mg/dL',
      'New exertional retrosternal heaviness in post-PCI patient',
      'Severe Grade III tricompartmental knee osteoarthritis',
    ],
    missingInformation: ['Urgent Treadmill Test / 2D Echo review with cardiologist'],
    conversationTranscript: [
      {
        id: 'msg-p3-1',
        sender: 'ai',
        text: 'Namaste Ramesh ji. I am Swasthya AI Clinical Assistant. What is the primary issue you wish to discuss with the doctor today?',
        translatedText: 'Namaste Ramesh ji. I am Swasthya AI Clinical Assistant. What is the primary issue you wish to discuss with the doctor today?',
        timestamp: '09:01 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p3-2',
        sender: 'patient',
        text: 'My knees have been hurting terribly for months, especially while climbing stairs. Also, recently I feel a heaviness in my chest when I walk briskly.',
        translatedText: 'My knees have been hurting terribly for months, especially while climbing stairs. Also, recently I feel a heaviness in my chest when I walk briskly.',
        timestamp: '09:02 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p3-3',
        sender: 'ai',
        text: 'I see your hospital discharge summary shows a heart stent placed in your LAD in 2021. Are you taking all your prescribed heart medications regularly?',
        translatedText: 'I see your hospital discharge summary shows a heart stent placed in your LAD in 2021. Are you taking all your prescribed heart medications regularly?',
        timestamp: '09:03 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p3-4',
        sender: 'patient',
        text: 'I take Aspirin and blood pressure tablet daily, but I stopped the Rosuvastatin 20mg cholesterol tablet 3 months ago because my legs were aching.',
        translatedText: 'I take Aspirin and blood pressure tablet daily, but I stopped the Rosuvastatin 20mg cholesterol tablet 3 months ago because my legs were aching.',
        timestamp: '09:04 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p3-5',
        sender: 'ai',
        text: 'Please note: Stopping a statin after heart stenting carries serious cardiac risk. Your recent lab shows LDL cholesterol has jumped to 168 mg/dL. I have highlighted this critical alert for Dr. Sharma immediately.',
        translatedText: 'Please note: Stopping a statin after heart stenting carries serious cardiac risk. Your recent lab shows LDL cholesterol has jumped to 168 mg/dL. I have highlighted this critical alert for Dr. Sharma immediately.',
        timestamp: '09:05 AM',
        clinicalTag: 'red_flag',
      },
      {
        id: 'msg-p3-6',
        sender: 'patient',
        text: 'Thank you for explaining, Sister. Also, please do not give me painkiller pills like Diclofenac, they burn my stomach lining.',
        translatedText: 'Thank you for explaining, Sister. Also, please do not give me painkiller pills like Diclofenac, they burn my stomach lining.',
        timestamp: '09:06 AM',
        clinicalTag: 'allergy',
      },
      {
        id: 'msg-p3-7',
        sender: 'ai',
        text: 'NSAID allergy and gastric sensitivity noted. Complete cardiology discharge summary and lipid profile are on doctor screen.',
        translatedText: 'NSAID allergy and gastric sensitivity noted. Complete cardiology discharge summary and lipid profile are on doctor screen.',
        timestamp: '09:07 AM',
        clinicalTag: 'wrap_up',
      },
    ],
    interviewCompleted: true,
    stage: 'completed',
    updatedAt: '2026-08-29T09:07:00.000Z',
  },

  // PATIENT 004 / 104: SAVITRI DEVI / MEERA PATEL
  'PAT-004': {
    interviewId: 'int-pat-004',
    patientId: 'PAT-004',
    language: 'hi',
    chiefComplaint: 'Severe throbbing headache with visual blurriness (BP 185/105 mmHg)',
    symptoms: [
      'Severe throbbing occipital and frontal headache',
      'Blurred vision and black spots in visual field',
      'Dizziness / unsteady equilibrium',
      'Blood pressure measured at 185/105 mmHg',
      'Mild nausea without vomiting',
    ],
    onset: 'This morning at 6:00 AM upon waking up',
    duration: '3 hours',
    severity: '9/10',
    location: 'Bilateral occipital and temple regions',
    radiation: 'Radiates to neck and shoulders',
    character: 'Intense pulsating, pounding sensation',
    aggravatingFactors: 'Bright lights, sudden head turning, standing up quickly',
    relievingFactors: 'Darkened room, cool compress on forehead',
    associatedSymptoms: ['Photophobia', 'Tinnitus (ringing in ears)'],
    medicalHistory: ['Long-standing Essential Hypertension (8 years, irregular medication)', 'Cervical Spondylosis'],
    surgicalHistory: ['Cataract surgery bilateral (2020)'],
    medicationHistory: [
      { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Irregular', prescribedFor: 'Hypertension' },
    ],
    allergies: ['Sulfa drugs (causes widespread itchy rash)'],
    familyHistory: ['Mother suffered hypertensive hemorrhagic stroke at age 65'],
    lifestyle: {
      diet: 'Vegetarian, prefers salty pickles and fried papad',
      smokingOrTobacco: 'No',
      alcohol: 'No',
      physicalActivity: 'Sedentary',
    },
    previousTreatments: ['Took 1 Paracetamol at home with zero pain reduction.'],
    documentsReferenced: ['doc-p4-ecg', 'doc-p4-rx', 'doc-p4-mri'],
    redFlags: [
      'ACCELERATED HYPERTENSIVE URGENCY: BP 185/105 mmHg with acute headache and visual blurring',
      'ECG shows Left Ventricular Hypertrophy (LVH) with strain pattern',
      'Family history of maternal stroke',
    ],
    missingInformation: ['Urgent fundoscopy exam by ophthalmologist for papilledema'],
    conversationTranscript: [
      {
        id: 'msg-p4-1',
        sender: 'ai',
        text: 'नमस्ते सावित्री जी। मैं स्वास्थ्या एआई नर्स हूँ। कृपया बताइये सुबह से क्या परेशानी हो रही है?',
        translatedText: 'Namaste Savitri ji. I am Swasthya AI Nurse. Please tell me what difficulty you have been facing since morning?',
        timestamp: '08:16 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p4-2',
        sender: 'patient',
        text: 'सुबह सोकर उठी तो सिर में बहुत भयंकर दर्द हो रहा है, आंखों के आगे अंधेरा छा रहा है और चक्कर आ रहे हैं।',
        translatedText: 'When I woke up in the morning, I had intense throbbing headache, darkness before eyes, and dizziness.',
        timestamp: '08:17 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p4-3',
        sender: 'ai',
        text: 'ओपीडी रिसेप्शन पर आपका ब्लड प्रेशर 185/105 mmHg आया है। क्या आप बीपी की दवा रोज़ाना समय पर लेती हैं?',
        translatedText: 'At the OPD reception your blood pressure was 185/105 mmHg. Do you take your BP medicine daily on time?',
        timestamp: '08:18 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p4-4',
        sender: 'patient',
        text: 'पिछले तीन दिनों से बीपी की गोली खत्म हो गई थी तो मैंने नहीं खाई। सिर फटने जैसा हो रहा है।',
        translatedText: 'For the last 3 days my BP medicine was finished so I did not take it. My head feels like bursting.',
        timestamp: '08:19 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p4-5',
        sender: 'ai',
        text: 'सावित्री जी, यह अत्यधिक उच्च रक्तचाप (Hypertensive Emergency) की स्थिति है। मैंने डॉक्टर राजेश शर्मा को तुरंत रेड-फ्लैग अलर्ट भेज दिया है। आपकी ईसीजी रिपोर्ट भी लोड कर दी गई है।',
        translatedText: 'Savitri ji, this is Hypertensive Urgency. I have sent an immediate red-flag alert to Dr. Rajesh Sharma. Your ECG report has also been loaded.',
        timestamp: '08:20 AM',
        clinicalTag: 'red_flag',
      },
    ],
    interviewCompleted: true,
    stage: 'completed',
    updatedAt: '2026-08-29T08:20:00.000Z',
  },

  // PATIENT 005 / 105: GURPREET SINGH
  'PAT-005': {
    interviewId: 'int-pat-005',
    patientId: 'PAT-005',
    language: 'pa',
    chiefComplaint: 'Diabetes follow-up, burning sensation in feet & microalbuminuria',
    symptoms: [
      'Burning numbness & tingling sensations in soles of bilateral feet (stocking distribution)',
      'Frequent nocturia (waking 3 times at night to urinate)',
      'Dry mouth and persistent thirst',
      'HbA1c elevated at 9.2%',
    ],
    onset: 'Gradual over 6 months, tingling worse at night',
    duration: '6 months',
    severity: '6/10',
    location: 'Bilateral feet and lower shins',
    radiation: 'Distal to proximal',
    character: 'Burning paresthesia, pins-and-needles sensation',
    aggravatingFactors: 'Night time, tight footwear, prolonged walking',
    relievingFactors: 'Open sandals, elevating feet',
    associatedSymptoms: ['Mild blurred vision', 'Fatigue in late afternoons'],
    medicalHistory: ['Type 2 Diabetes Mellitus (14 years duration)', 'Mild Dyslipidemia'],
    surgicalHistory: ['None'],
    medicationHistory: [
      { name: 'Metformin 500mg', dosage: '500mg', frequency: 'BD After Meals', prescribedFor: 'Type 2 Diabetes' },
      { name: 'Glimepiride 1mg', dosage: '1mg', frequency: 'OD Before Breakfast', prescribedFor: 'Blood Sugar' },
    ],
    allergies: ['No known drug allergies (NKDA)'],
    familyHistory: ['Both parents had Type 2 Diabetes with renal complications'],
    lifestyle: {
      diet: 'High carbohydrate North Indian diet with sweets on festivals',
      smokingOrTobacco: 'No',
      alcohol: 'Occasional beer',
      physicalActivity: 'Light walking in park 15 minutes daily',
    },
    previousTreatments: ['Taking Metformin 500mg regularly, but diet control has been poor.'],
    documentsReferenced: ['doc-p5-hba1c', 'doc-p5-rx', 'doc-p5-foot'],
    redFlags: [
      'UNCONTROLLED DIABETES: HbA1c 9.2% with early diabetic nephropathy (Microalbuminuria 145 mg/g)',
      'Symptomatic Diabetic Peripheral Neuropathy with bilateral loss of vibratory sensation',
    ],
    missingInformation: ['Annual dilated eye fundus evaluation for diabetic retinopathy'],
    conversationTranscript: [
      {
        id: 'msg-p5-1',
        sender: 'ai',
        text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਗੁਰਪ੍ਰੀਤ ਜੀ। ਮੈਂ ਸਵਾਸਥਿਆ ਏਆਈ ਨਰਸ ਹਾਂ। ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਤਕਲੀਫ ਮਹਿਸੂਸ ਹੋ ਰਹੀ ਹੈ?',
        translatedText: 'Sat Sri Akal Gurpreet ji. I am Swasthya AI Nurse. What health difficulties are you experiencing today?',
        timestamp: '07:46 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p5-2',
        sender: 'patient',
        text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ। ਮੈਨੂੰ ਪਿਛਲੇ ਛੇ ਮਹੀਨਿਆਂ ਤੋਂ ਪੈਰਾਂ ਦੀਆਂ ਤਲੀਆਂ ਵਿੱਚ ਬਹੁਤ ਜ਼ਿਆਦਾ ਜਲਨ ਅਤੇ ਸੁੰਨਪਣ ਰਹਿੰਦਾ ਹੈ, ਖਾਸ ਕਰਕੇ ਰਾਤ ਨੂੰ ਸੌਣ ਵੇਲੇ।',
        translatedText: 'Sat Sri Akal ji. For the last six months I have severe burning and numbness in the soles of my feet, especially when sleeping at night.',
        timestamp: '07:47 AM',
        clinicalTag: 'chief_complaint',
      },
      {
        id: 'msg-p5-3',
        sender: 'ai',
        text: 'ਕੀ ਤੁਹਾਨੂੰ ਰਾਤ ਨੂੰ ਵਾਰ-ਵਾਰ ਪਿਸ਼ਾਬ ਲਈ ਉੱਠਣਾ ਪੈਂਦਾ ਹੈ? ਤੁਹਾਡੀ ਹਾਲੀਆ HbA1c ਰਿਪੋਰਟ 9.2% ਆਈ ਹੈ ਜੋ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ।',
        translatedText: 'Do you have to wake up frequently at night to urinate? Your recent HbA1c report is 9.2%, which is quite high.',
        timestamp: '07:48 AM',
        clinicalTag: 'symptom_detail',
      },
      {
        id: 'msg-p5-4',
        sender: 'patient',
        text: 'ਹਾਂਜੀ, ਰਾਤ ਨੂੰ ਤਿੰਨ ਵਾਰ ਉੱਠਣਾ ਪੈਂਦਾ ਹੈ ਅਤੇ ਪਿਆਸ ਵੀ ਬਹੁਤ ਲੱਗਦੀ ਹੈ। ਮੈਂ ਮੈਟਫਾਰਮਿਨ ਲੈਂਦਾ ਹਾਂ ਪਰ ਸ਼ੂਗਰ ਕੰਟਰੋਲ ਨਹੀਂ ਹੋ ਰਹੀ।',
        translatedText: 'Yes, I have to wake up 3 times at night and feel very thirsty. I take Metformin but sugar is not under control.',
        timestamp: '07:49 AM',
        clinicalTag: 'medication',
      },
      {
        id: 'msg-p5-5',
        sender: 'ai',
        text: 'ਗੁਰਪ੍ਰੀਤ ਜੀ, ਇਹ ਸ਼ੂਗਰ ਕਾਰਨ ਨਸਾਂ ਦੀ ਕਮਜ਼ੋਰੀ (Diabetic Neuropathy) ਦੇ ਲੱਛਣ ਹਨ। ਤੁਹਾਡੀ ਸ਼ੂਗਰ ਰਿਪੋਰਟ ਅਤੇ ਪੈਸ਼ਾਬ ਟੈਸਟ ਡਾਕਟਰ ਸਾਹਿਬ ਦੇ ਸਕ੍ਰੀਨ ਤੇ ਲਿੰਕ ਕਰ ਦਿੱਤੇ ਗਏ ਹਨ।',
        translatedText: 'Gurpreet ji, these symptoms indicate diabetic nerve weakness (Diabetic Neuropathy). Your diabetic panel and urine tests have been linked to the doctor’s screen.',
        timestamp: '07:50 AM',
        clinicalTag: 'wrap_up',
      },
    ],
    interviewCompleted: true,
    stage: 'completed',
    updatedAt: '2026-08-29T07:50:00.000Z',
  },
};

// Aliases for PAT-101 .. PAT-104
SEEDED_INTERVIEWS['PAT-101'] = { ...SEEDED_INTERVIEWS['PAT-001'], patientId: 'PAT-101' };
SEEDED_INTERVIEWS['PAT-102'] = { ...SEEDED_INTERVIEWS['PAT-002'], patientId: 'PAT-102' };
SEEDED_INTERVIEWS['PAT-103'] = { ...SEEDED_INTERVIEWS['PAT-003'], patientId: 'PAT-103' };
SEEDED_INTERVIEWS['PAT-104'] = { ...SEEDED_INTERVIEWS['PAT-004'], patientId: 'PAT-104' };

// ----------------------------------------------------
// 2. RICH MEDICAL DOCUMENTS, SCANS & PRESCRIPTIONS
// ----------------------------------------------------

export const SEEDED_DOCUMENTS: MedicalDocument[] = [
  // --- PATIENT 001 / 101: RAHUL KUMAR ---
  {
    id: 'doc-p1-usg',
    patientId: 'PAT-001',
    title: 'Abdominal Ultrasound Scan (Appendix Protocol)',
    documentName: 'Abdominal_Ultrasound_Appendix_MaxImaging.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-28',
    uploadedAt: '2026-08-28T16:40:00.000Z',
    uploadedBy: 'Max Imaging Center & Diagnostics',
    facilityOrDoctor: 'Dr. Meena Saxena, MD (Radiodiagnosis)',
    ocrConfidence: 98,
    isAiExtracted: true,
    requiresDoctorReview: true,
    fileUrl: createRadiologyScanSvg({
      facilityName: 'MAX IMAGING & RADIOLOGY CENTER',
      patientName: 'Rahul Kumar',
      age: 28,
      gender: 'Male',
      date: '28 Aug 2026',
      studyType: 'Targeted High-Resolution Abdominal Ultrasound',
      findings:
        'Targeted real-time high-resolution sonography of the right iliac fossa demonstrates a blind-ending, aperistaltic, non-compressible tubular structure at the base of the cecum. Outer wall-to-wall diameter measures 7.8 mm (normal cutoff < 6 mm). Increased echogenicity of surrounding mesenteric fat noted (periappendiceal fat stranding). Minimal free fluid in the pelvis.',
      impression:
        'Sonographic features consistent with ACUTE EARLY APPENDICITIS without perforation or loculated abscess. Immediate surgical evaluation recommended.',
      radiologist: 'Dr. Meena Saxena, MD',
    }),
    extractedText: `MAX IMAGING & RADIOLOGY CENTER - GURUGRAM
Patient: Rahul Kumar | Age: 28 Y | Gender: Male | Date: 28-Aug-2026
STUDY: ULTRASOUND WHOLE ABDOMEN WITH SPECIAL RLQ ATTENTION

FINDINGS:
Liver: Normal size and echotexture. No focal lesion.
Gallbladder: Normal lumen, no calculi.
Pancreas & Spleen: Unremarkable.
Kidneys: Normal bilateral corticomedullary differentiation.
RIGHT ILIAC FOSSA:
- Blind-ending, non-compressible tubular structure identified at McBurney point.
- Appendiceal outer diameter measures 7.8 mm (Normal < 6 mm).
- Mild periappendiceal mesenteric hypervascularity and fat halo.
- No free air under diaphragm. No localized abscess collection.

IMPRESSION:
Features strongly indicative of ACUTE APPENDICITIS. Correlate with clinical tenderness and leukocytosis. Urgent surgical consult advised.`,
    extractedData: {
      diagnoses: ['Acute Appendicitis (Early stage, 7.8mm outer diameter)'],
      keyFindings: [
        'Non-compressible blind-ending loop in RLQ (7.8mm diameter)',
        'Periappendiceal fat stranding and hyperechoic halo',
        'No perforation or generalized peritonitis',
      ],
      labResults: [
        { testName: 'Appendix Outer Diameter', value: '7.8', unit: 'mm', referenceRange: '< 6.0 mm', status: 'critical' },
      ],
    },
  },

  {
    id: 'doc-p1-rx',
    patientId: 'PAT-001',
    title: 'Previous OPD Prescription Slip (Max Super Speciality)',
    documentName: 'OPD_Prescription_MaxHospital_DrSen.pdf',
    documentType: 'prescription',
    documentDate: '2026-08-15',
    uploadedAt: '2026-08-15T11:30:00.000Z',
    uploadedBy: 'Max Super Speciality Hospital, Gurugram',
    facilityOrDoctor: 'Dr. A. K. Sen, MD (Internal Medicine)',
    ocrConfidence: 96,
    isAiExtracted: true,
    fileUrl: createPrescriptionSvg({
      hospitalName: 'MAX SUPER SPECIALITY HOSPITAL',
      doctorName: 'Dr. A. K. Sen, MD',
      specialty: 'Senior Consultant • Internal Medicine',
      patientName: 'Rahul Kumar',
      age: 28,
      gender: 'Male',
      date: '15 Aug 2026',
      rxId: 'RX-MAX-88421',
      diagnosis: 'Functional Dyspepsia & Mild Upper Respiratory Infection',
      allergies: 'CRITICAL: Severe Anaphylactoid Allergy to PENICILLIN (Avoid Beta-Lactams)',
      medicines: [
        { name: 'Pantoprazole Sodium 40mg', dosage: '40mg', frequency: 'Once Daily (Empty stomach)', duration: '14 days', instructions: 'Take 30 mins before morning breakfast' },
        { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'Twice daily SOS', duration: '5 days', instructions: 'Take strictly after food if fever > 100°F' },
        { name: 'Antacid Gel (Magaldrate + Simethicone)', dosage: '10ml', frequency: 'Thrice daily after meals', duration: '7 days', instructions: 'Shake well before use' },
      ],
    }),
    extractedText: `MAX SUPER SPECIALITY HOSPITAL - OPD PRESCRIPTION
Doctor: Dr. A. K. Sen, MD (Int. Med) | Reg: MCI-44129
Patient: Rahul Kumar | Age: 28/M | Date: 15-Aug-2026
Diagnosis: Dyspeptic symptoms, seasonal pharyngitis.

ALLERGY WARNING:
PATIENT HAS DOCUMENTED SEVERE ALLERGY TO PENICILLIN (HIVES/URTICARIA). DO NOT PRESCRIBE AMOXICILLIN OR CEPHALOSPORINS.

Rx:
1. Tab Pantoprazole 40mg - 1 tab OD before breakfast x 14 days
2. Tab Paracetamol 650mg - 1 tab SOS for bodyache/fever x 5 days
3. Syr Gelusil MPS - 2 tsp TDS after meals x 7 days

Advised: Light bland diet. Avoid spicy fried food. Return if abdominal pain localizes.`,
    extractedData: {
      medications: [
        { name: 'Pantoprazole', dosage: '40mg', frequency: 'OD', duration: '14 days', prescribedFor: 'Dyspepsia' },
        { name: 'Paracetamol', dosage: '650mg', frequency: 'SOS', duration: '5 days', prescribedFor: 'Fever' },
      ],
      diagnoses: ['Functional Dyspepsia'],
      keyFindings: ['Known Penicillin allergy documented in hospital electronic health system'],
    },
  },

  {
    id: 'doc-p1-cbc',
    patientId: 'PAT-001',
    title: 'Complete Blood Count (CBC & TLC Hematology)',
    documentName: 'CBC_Hemogram_Report_Thyrocare.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-28',
    uploadedAt: '2026-08-28T18:00:00.000Z',
    uploadedBy: 'Thyrocare Diagnostics',
    facilityOrDoctor: 'Dr. S. K. Gupta, MD (Pathology)',
    ocrConfidence: 99,
    isAiExtracted: true,
    fileUrl: createLabReportSvg({
      labName: 'THYROCARE CLINICAL PATHOLOGY LAB',
      patientName: 'Rahul Kumar',
      age: 28,
      gender: 'Male',
      date: '28 Aug 2026',
      sampleId: 'THY-BLD-9921',
      testTitle: 'Complete Hemogram & Differential Leukocyte Count (DLC)',
      results: [
        { test: 'Total Leukocyte Count (TLC / WBC)', result: '14,800', unit: '/cu.mm', range: '4,000 - 11,000', status: 'critical' },
        { test: 'Neutrophils', result: '84', unit: '%', range: '40 - 70', status: 'high' },
        { test: 'Lymphocytes', result: '12', unit: '%', range: '20 - 45', status: 'low' },
        { test: 'Hemoglobin (Hb)', result: '14.4', unit: 'g/dL', range: '13.0 - 17.0', status: 'normal' },
        { test: 'Platelet Count', result: '2.85', unit: 'Lakhs/cu.mm', range: '1.50 - 4.50', status: 'normal' },
      ],
      impression:
        'Marked polymorphonuclear leukocytosis (TLC 14,800 with 84% neutrophils). In conjunction with acute RLQ abdominal pain and fever, this profile strongly supports acute bacterial infection / acute appendicitis.',
      pathologist: 'Dr. S. K. Gupta, MD (Pathology)',
    }),
    extractedText: `THYROCARE DIAGNOSTICS - CLINICAL HEMATOLOGY REPORT
Patient: Rahul Kumar | Age: 28 Y/M | Ref: OPD Clinic
Investigation: Complete Blood Count (CBC)

Hemoglobin: 14.4 g/dL (Normal: 13.0 - 17.0)
Total WBC Count: 14,800 /cu.mm (CRITICAL HIGH: 4,000 - 11,000)
Differential Count:
- Neutrophils: 84% (HIGH: 40 - 70%)
- Lymphocytes: 12% (LOW: 20 - 45%)
- Monocytes: 03% (Normal)
- Eosinophils: 01% (Normal)
Platelet Count: 2.85 Lakhs/cu.mm (Normal: 1.5 - 4.5)

PATHOLOGIST COMMENT:
Neutrophilic leukocytosis indicates acute systemic inflammatory or bacterial pathology.`,
    extractedData: {
      labResults: [
        { testName: 'Total Leukocyte Count (TLC)', value: '14,800', unit: '/cu.mm', referenceRange: '4,000 - 11,000', status: 'critical' },
        { testName: 'Neutrophils', value: '84', unit: '%', referenceRange: '40 - 70', status: 'high' },
        { testName: 'Hemoglobin', value: '14.4', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'normal' },
      ],
      diagnoses: ['Acute Leukocytosis (Bacterial / Appendiceal inflammatory origin)'],
    },
  },

  // --- PATIENT 002 / 102: ANITA SHARMA / SUNITA DEVI ---
  {
    id: 'doc-p2-cxr',
    patientId: 'PAT-002',
    title: 'Chest X-Ray PA View (Pneumonia Evaluation)',
    documentName: 'Chest_XRay_PA_CityDiagnostics.pdf',
    documentType: 'imaging_scan',
    documentDate: '2026-08-27',
    uploadedAt: '2026-08-27T11:20:00.000Z',
    uploadedBy: 'City Diagnostic Labs & Imaging',
    facilityOrDoctor: 'Dr. Harsh Vardhan, MD (Radiology)',
    ocrConfidence: 97,
    isAiExtracted: true,
    fileUrl: createRadiologyScanSvg({
      facilityName: 'CITY DIAGNOSTIC LABS & IMAGING',
      patientName: 'Anita Sharma',
      age: 45,
      gender: 'Female',
      date: '27 Aug 2026',
      studyType: 'Digital Radiography (DR) Chest PA View',
      findings:
        'Chest PA View shows an ill-defined patchy radio-opacity with air bronchograms localized in the right middle zone, obscuring the right heart border (positive silhouette sign). Left lung field is well aerated and clear. Both costophrenic angles are sharp. Cardiothoracic ratio is within normal limits. Trachea is central.',
      impression:
        'Radiological findings diagnostic of RIGHT MIDDLE LOBE BRONCHOPNEUMONIA (Community-Acquired). Recommend antibiotic therapy and clinical correlation with oxygen saturation.',
      radiologist: 'Dr. Harsh Vardhan, MD (Radiology)',
    }),
    extractedText: `CITY DIAGNOSTIC LABS - DEPARTMENT OF RADIOLOGY
Patient: Anita Sharma | Age: 45 Y/F | Date: 27-Aug-2026
EXAMINATION: CHEST X-RAY (POSTEROANTERIOR VIEW)

OBSERVATIONS:
- Right middle lobe reveals inhomogeneous consolidation with prominent air bronchograms.
- Silhouette sign positive along right cardiac margin.
- Left lung zone is clear without focal infiltrate or mass.
- Hilar vascular shadows normal.
- Cardiac silhouette is normal in contour and transverse diameter.
- Bony thorax and soft tissue contours unremarkable.

IMPRESSION:
Features consistent with Right Middle Lobe Pneumonia.`,
    extractedData: {
      diagnoses: ['Right Middle Lobe Bronchopneumonia (Community-Acquired)'],
      keyFindings: ['Patchy consolidation in right middle zone', 'Air bronchograms visible', 'No pleural effusion'],
    },
  },

  {
    id: 'doc-p2-rx',
    patientId: 'PAT-002',
    title: 'Pulmonology OPD Prescription (Apollo Hospitals)',
    documentName: 'Pulmonology_Prescription_Apollo_DrNair.pdf',
    documentType: 'prescription',
    documentDate: '2026-08-20',
    uploadedAt: '2026-08-20T10:15:00.000Z',
    uploadedBy: 'Apollo Hospitals OPD Clinic',
    facilityOrDoctor: 'Dr. Priya Nair, MD (Pulmonary Medicine)',
    ocrConfidence: 98,
    isAiExtracted: true,
    fileUrl: createPrescriptionSvg({
      hospitalName: 'APOLLO HOSPITALS MEDICAL CENTRE',
      doctorName: 'Dr. Priya Nair, MD',
      specialty: 'Senior Pulmonologist & Chest Specialist',
      patientName: 'Anita Sharma',
      age: 45,
      gender: 'Female',
      date: '20 Aug 2026',
      rxId: 'RX-APOLLO-7729',
      diagnosis: 'Allergic Airway Hyperresponsiveness & Dry Bronchitic Cough',
      allergies: 'No Known Drug Allergies (NKDA)',
      medicines: [
        { name: 'Montelukast + Levocetirizine (10mg/5mg)', dosage: '1 Tab', frequency: 'Once daily at bedtime', duration: '15 days', instructions: 'Take after dinner' },
        { name: 'Budesonide 200mcg Rotacaps', dosage: '200mcg', frequency: 'Twice daily via Rotahaler', duration: '30 days', instructions: 'Rinse mouth thoroughly with water after inhalation' },
        { name: 'Ambroxol + Levosalbutamol Syrup', dosage: '5ml', frequency: 'Thrice daily', duration: '7 days', instructions: 'For relief of cough and chest tightness' },
      ],
    }),
    extractedText: `APOLLO HOSPITALS - PULMONOLOGY OPD
Patient: Anita Sharma | Age: 45/F | Date: 20-Aug-2026
Diagnosis: Seasonal Bronchospasm & Cough

Rx:
1. Tab Montelukast + Levocetirizine (10/5mg) - 1 tab HS x 15 days
2. Budesonide 200mcg Rotacaps - 1 cap BD with Rotahaler x 30 days
3. Syr Levosalbutamol + Ambroxol - 5ml TDS x 7 days
Advised: Steam inhalation BD. Drink warm fluids.`,
    extractedData: {
      medications: [
        { name: 'Montelukast + Levocetirizine', dosage: '10/5mg', frequency: 'HS', duration: '15 days' },
        { name: 'Budesonide Inhaler', dosage: '200mcg', frequency: 'BD', duration: '30 days' },
      ],
      diagnoses: ['Allergic Bronchitis'],
    },
  },

  {
    id: 'doc-p2-crp',
    patientId: 'PAT-002',
    title: 'Serum C-Reactive Protein (CRP) Inflammatory Marker',
    documentName: 'CRP_Inflammatory_Marker_ApolloDiagnostics.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-27',
    uploadedAt: '2026-08-27T14:30:00.000Z',
    uploadedBy: 'Apollo Diagnostics Laboratory',
    facilityOrDoctor: 'Dr. K. R. Raman, MD (Biochemistry)',
    ocrConfidence: 99,
    isAiExtracted: true,
    fileUrl: createLabReportSvg({
      labName: 'APOLLO DIAGNOSTICS CENTRAL LAB',
      patientName: 'Anita Sharma',
      age: 45,
      gender: 'Female',
      date: '27 Aug 2026',
      sampleId: 'AP-IMM-3312',
      testTitle: 'Quantitative Serum C-Reactive Protein (High Sensitivity CRP)',
      results: [
        { test: 'Serum C-Reactive Protein (CRP)', result: '48.5', unit: 'mg/L', range: '< 5.0 mg/L', status: 'critical' },
        { test: 'Erythrocyte Sedimentation Rate (ESR)', result: '52', unit: 'mm/1st hr', range: '0 - 20 mm/hr', status: 'high' },
        { test: 'Random Blood Glucose', result: '118', unit: 'mg/dL', range: '70 - 140 mg/dL', status: 'normal' },
      ],
      impression:
        'Markedly elevated CRP (48.5 mg/L) and ESR (52 mm/hr), corroborating acute lower respiratory tract bacterial parenchymal infection.',
      pathologist: 'Dr. K. R. Raman, MD',
    }),
    extractedText: `APOLLO DIAGNOSTICS - CLINICAL BIOCHEMISTRY
Patient: Anita Sharma | Age: 45/F | Date: 27-Aug-2026
Test: High-Sensitivity Serum CRP
Measured Value: 48.5 mg/L (Reference: < 5.0 mg/L) - CRITICAL HIGH
ESR (Westergren): 52 mm/1st hr (Reference: 0 - 20) - HIGH
Significance: Severe active inflammatory / infective response.`,
    extractedData: {
      labResults: [
        { testName: 'Serum CRP', value: '48.5', unit: 'mg/L', referenceRange: '< 5.0 mg/L', status: 'critical' },
        { testName: 'ESR', value: '52', unit: 'mm/hr', referenceRange: '0 - 20 mm/hr', status: 'high' },
      ],
    },
  },

  // --- PATIENT 003 / 103: RAMESH SINGH / AMITABH SEN ---
  {
    id: 'doc-p3-discharge',
    patientId: 'PAT-003',
    title: 'Hospital Discharge Summary (Post-PCI Stenting in LAD)',
    documentName: 'Hospital_Discharge_Summary_PCI_FortisEscorts.pdf',
    documentType: 'discharge_summary',
    documentDate: '2021-11-14',
    uploadedAt: '2021-11-14T10:00:00.000Z',
    uploadedBy: 'Fortis Escorts Heart Institute, New Delhi',
    facilityOrDoctor: 'Dr. Ashok Seth, MD, DM, FRCP (Chief Cardiologist)',
    ocrConfidence: 99,
    isAiExtracted: true,
    fileUrl: createDischargeSummarySvg({
      hospitalName: 'FORTIS ESCORTS HEART INSTITUTE',
      patientName: 'Ramesh Singh',
      age: 68,
      gender: 'Male',
      admissionDate: '10 Nov 2021',
      dischargeDate: '14 Nov 2021',
      ipNo: 'FEHI-IP-78219',
      finalDiagnosis: 'Acute Coronary Syndrome - NSTEMI / Single Vessel CAD (Critical Mid-LAD Stenosis)',
      procedureDone: 'Primary Coronary Angioplasty with Drug-Eluting Stent (Xience Sierra 3.0 x 24mm) to Mid-LAD',
      dischargeCourse:
        'Patient admitted with rest angina and ST depression in V1-V4. Coronary angiography revealed 95% eccentric thrombus-laden lesion in Mid-LAD. Successful direct stenting with Xience Sierra 3.0 x 24mm was performed with TIMI-3 flow and 0% residual stenosis. Post-procedure period uneventful. Echocardiogram shows LVEF 52% with mild hypokinesia of anterior septum.',
      dischargeMeds: [
        'Aspirin 75mg OD post-lunch indefinitely',
        'Clopidogrel 75mg OD x 12 months',
        'Rosuvastatin 20mg OD at bedtime (STRICT COMPLIANCE MANDATED)',
        'Metoprolol Succinate 25mg OD morning',
        'Pantoprazole 40mg OD before breakfast (Gastroprotection for DAPT)',
      ],
      treatingConsultant: 'Dr. Ashok Seth, DM (Cardiology)',
    }),
    extractedText: `FORTIS ESCORTS HEART INSTITUTE - DISCHARGE SUMMARY
Patient: Ramesh Singh | Age: 68 Y/M | IP: FEHI-78219
Diagnosis: Acute Coronary Syndrome (NSTEMI) / CAD / SVD.
Procedure: Primary PTCA with Stenting to Mid-LAD with Xience Sierra 3.0 x 24mm DES. TIMI 3 flow achieved.

DISCHARGE MEDICATIONS:
1. Tab Aspirin 75mg OD indefinitely
2. Tab Clopidogrel 75mg OD x 1 year
3. Tab Rosuvastatin 20mg OD at bedtime - DO NOT STOP WITHOUT CARDIOLOGIST APPROVAL
4. Tab Metoprolol 25mg OD
5. Tab Pantoprazole 40mg OD

CRITICAL ADVICE:
Strict adherence to high-intensity statin (Rosuvastatin 20mg) is imperative to prevent in-stent thrombosis and progression of atheromatous plaque.`,
    extractedData: {
      diagnoses: ['Post-PCI status with DES in Mid-LAD', 'Coronary Artery Disease'],
      medications: [
        { name: 'Aspirin', dosage: '75mg', frequency: 'OD', prescribedFor: 'Secondary CAD prevention' },
        { name: 'Rosuvastatin', dosage: '20mg', frequency: 'OD HS', prescribedFor: 'Statin plaque stabilization' },
      ],
      keyFindings: ['Drug Eluting Stent placed in LAD (2021)', 'LVEF 52%'],
    },
  },

  {
    id: 'doc-p3-lipid',
    patientId: 'PAT-003',
    title: 'Comprehensive Lipid Profile (Post Statin Discontinuation)',
    documentName: 'Lipid_Panel_Report_LalPathLabs.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-10',
    uploadedAt: '2026-08-10T09:15:00.000Z',
    uploadedBy: 'Dr. Lal PathLabs',
    facilityOrDoctor: 'Dr. V. K. Malhotra, MD (Pathology)',
    ocrConfidence: 99,
    isAiExtracted: true,
    fileUrl: createLabReportSvg({
      labName: 'DR. LAL PATHLABS REFERENCE LABORATORY',
      patientName: 'Ramesh Singh',
      age: 68,
      gender: 'Male',
      date: '10 Aug 2026',
      sampleId: 'LAL-LIP-8812',
      testTitle: 'Complete Fasting Lipid Profile Panel',
      results: [
        { test: 'Total Cholesterol', result: '242', unit: 'mg/dL', range: '< 200 mg/dL', status: 'high' },
        { test: 'LDL Cholesterol (Direct)', result: '168', unit: 'mg/dL', range: '< 70 mg/dL (CAD Goal)', status: 'critical' },
        { test: 'HDL Cholesterol (Good)', result: '38', unit: 'mg/dL', range: '> 40 mg/dL', status: 'low' },
        { test: 'Serum Triglycerides', result: '190', unit: 'mg/dL', range: '< 150 mg/dL', status: 'high' },
        { test: 'VLDL Cholesterol', result: '36', unit: 'mg/dL', range: '< 30 mg/dL', status: 'high' },
      ],
      impression:
        'Severe rebound hypercholesterolemia with LDL-C at 168 mg/dL following self-discontinuation of Rosuvastatin. In a post-PCI CAD patient, target LDL must be < 55-70 mg/dL. High cardiovascular hazard.',
      pathologist: 'Dr. V. K. Malhotra, MD',
    }),
    extractedText: `DR. LAL PATHLABS - LIPID PROFILE
Patient: Ramesh Singh | Age: 68 Y/M | Date: 10-Aug-2026
Total Cholesterol: 242 mg/dL (High: Desirable < 200)
LDL Cholesterol: 168 mg/dL (CRITICAL HIGH: Target in Known CAD is < 55-70 mg/dL)
HDL Cholesterol: 38 mg/dL (Low: Desirable > 40)
Triglycerides: 190 mg/dL (High: Normal < 150)
INTERPRETATION: Marked atherogenic dyslipidemia following cessation of statin therapy.`,
    extractedData: {
      labResults: [
        { testName: 'LDL Cholesterol', value: '168', unit: 'mg/dL', referenceRange: '< 70 (CAD Goal)', status: 'critical' },
        { testName: 'Total Cholesterol', value: '242', unit: 'mg/dL', referenceRange: '< 200', status: 'high' },
      ],
    },
  },

  {
    id: 'doc-p3-xray',
    patientId: 'PAT-003',
    title: 'Bilateral Knee Weight-Bearing Radiographs',
    documentName: 'Knee_XRay_Bilateral_AIIMS.pdf',
    documentType: 'imaging_scan',
    documentDate: '2026-08-15',
    uploadedAt: '2026-08-15T11:00:00.000Z',
    uploadedBy: 'AIIMS Radiology Department, New Delhi',
    facilityOrDoctor: 'Dr. Rohit Sharma, MD (Musculoskeletal Radiology)',
    ocrConfidence: 96,
    isAiExtracted: true,
    fileUrl: createRadiologyScanSvg({
      facilityName: 'AIIMS DEPARTMENT OF RADIODIAGNOSIS',
      patientName: 'Ramesh Singh',
      age: 68,
      gender: 'Male',
      date: '15 Aug 2026',
      studyType: 'Bilateral Knee Standing Weight-Bearing AP & Lateral Views',
      findings:
        'Standing views of bilateral knees show severe, asymmetric joint space reduction in both medial compartments. Prominent marginal osteophytes noted along the tibial plateau and femoral condyles. Marked subchondral bone sclerosis and small subchondral pseudocysts. Patellofemoral joint space is moderately narrowed.',
      impression:
        'Grade III to IV Bilateral Knee Osteoarthritis, more pronounced on medial compartments. Advised physiotherapy, quadriceps strengthening, and avoid high-impact stair climbing.',
      radiologist: 'Dr. Rohit Sharma, MD',
    }),
    extractedText: `AIIMS - MUSCULOSKELETAL RADIOLOGY
Patient: Ramesh Singh | Age: 68 Y/M | Date: 15-Aug-2026
STUDY: BILATERAL KNEES WEIGHT BEARING RADIOGRAPHS
Observations:
- Marked joint space narrowing across medial femorotibial articulation bilaterally.
- Dense subchondral sclerosis with marginal tibial spiking and osteophytes.
- No bony erosion or periosteal reaction.
Impression: Severe Bilateral Knee Osteoarthritis (Kellgren-Lawrence Grade III).`,
    extractedData: {
      diagnoses: ['Bilateral Knee Osteoarthritis (Kellgren-Lawrence Grade III)'],
    },
  },

  // --- PATIENT 004 / 104: SAVITRI DEVI / MEERA PATEL ---
  {
    id: 'doc-p4-ecg',
    patientId: 'PAT-004',
    title: '12-Lead Electrocardiogram (Hypertensive Workup)',
    documentName: 'ECG_12Lead_SMSHospital_Jaipur.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-20',
    uploadedAt: '2026-08-20T08:30:00.000Z',
    uploadedBy: 'SMS Medical College Hospital, Jaipur',
    facilityOrDoctor: 'Dr. Anoop Agarwal, DM (Cardiology)',
    ocrConfidence: 98,
    isAiExtracted: true,
    fileUrl: createLabReportSvg({
      labName: 'SMS MEDICAL COLLEGE & HOSPITAL - EMERGENCY CARDIOLOGY',
      patientName: 'Savitri Devi',
      age: 72,
      gender: 'Female',
      date: '20 Aug 2026',
      sampleId: 'SMS-ECG-4401',
      testTitle: '12-Lead Electrocardiogram & Voltage Analysis',
      results: [
        { test: 'Heart Rate & Rhythm', result: '88 bpm', unit: 'bpm', range: '60 - 100 bpm (Sinus)', status: 'normal' },
        { test: 'Sokolow-Lyon Index (SV1 + RV5/V6)', result: '42.0', unit: 'mm', range: '< 35 mm (Normal)', status: 'critical' },
        { test: 'PR Interval', result: '160', unit: 'ms', range: '120 - 200 ms', status: 'normal' },
        { test: 'QRS Duration', result: '98', unit: 'ms', range: '< 120 ms', status: 'normal' },
        { test: 'ST-T Wave Changes', result: 'Asymmetric T-inversion in I, aVL, V5-V6', unit: 'Lead', range: 'No strain', status: 'high' },
      ],
      impression:
        'Normal sinus rhythm with definite Left Ventricular Hypertrophy (LVH) with systolic strain pattern. Secondary to chronic accelerated arterial hypertension.',
      pathologist: 'Dr. Anoop Agarwal, DM (Cardio)',
    }),
    extractedText: `SMS HOSPITAL JAIPUR - 12-LEAD ECG REPORT
Patient: Savitri Devi | Age: 72 Y/F | Date: 20-Aug-2026
Heart Rate: 88 bpm | PR: 160ms | QRS: 98ms | QTc: 432ms
Criteria: Sokolow-Lyon Index = 42mm (> 35mm threshold). Cornell Voltage positive.
FINDINGS:
Left Ventricular Hypertrophy (LVH) with ST-T strain in lateral leads (I, aVL, V5, V6). No acute STEMI changes.`,
    extractedData: {
      diagnoses: ['Left Ventricular Hypertrophy (LVH) secondary to Hypertension'],
    },
  },

  {
    id: 'doc-p4-rx',
    patientId: 'PAT-004',
    title: 'Hypertension Management Card (SMS Hospital)',
    documentName: 'Hypertension_Rx_SMSHospital.pdf',
    documentType: 'prescription',
    documentDate: '2026-08-10',
    uploadedAt: '2026-08-10T11:00:00.000Z',
    uploadedBy: 'SMS Hospital OPD Clinic',
    facilityOrDoctor: 'Dr. S. K. Sharma, MD',
    ocrConfidence: 96,
    isAiExtracted: true,
    fileUrl: createPrescriptionSvg({
      hospitalName: 'SMS MEDICAL COLLEGE HOSPITAL',
      doctorName: 'Dr. S. K. Sharma, MD',
      specialty: 'Department of Medicine & Hypertension Clinic',
      patientName: 'Savitri Devi',
      age: 72,
      gender: 'Female',
      date: '10 Aug 2026',
      rxId: 'RX-SMS-1192',
      diagnosis: 'Accelerated Essential Hypertension (Stage 2) & LVH',
      allergies: 'Allergic to Sulfa Drugs (Sulfonamides)',
      medicines: [
        { name: 'Telmisartan 40mg + Amlodipine 5mg', dosage: '1 Tab', frequency: 'Once daily morning', duration: '30 days', instructions: 'Take after breakfast, check BP daily' },
        { name: 'Hydrochlorothiazide 12.5mg', dosage: '12.5mg', frequency: 'Once daily morning', duration: '30 days', instructions: 'Take with glass of water' },
      ],
    }),
    extractedText: `SMS HOSPITAL - HYPERTENSION CLINIC
Patient: Savitri Devi | Age: 72/F | Date: 10-Aug-2026
Rx:
1. Tab Telmisartan 40mg + Amlodipine 5mg - 1 tab OD AM
2. Tab Hydrochlorothiazide 12.5mg - 1 tab OD AM
Diet: Strict low sodium salt < 2g/day.`,
    extractedData: {
      medications: [
        { name: 'Telmisartan + Amlodipine', dosage: '40/5mg', frequency: 'OD' },
        { name: 'Hydrochlorothiazide', dosage: '12.5mg', frequency: 'OD' },
      ],
      diagnoses: ['Essential Hypertension Stage 2'],
    },
  },

  // --- PATIENT 005 / 105: GURPREET SINGH ---
  {
    id: 'doc-p5-hba1c',
    patientId: 'PAT-005',
    title: 'Quarterly Diabetic Panel & Urine Albumin/Creatinine',
    documentName: 'HbA1c_Microalbumin_Report_Metropolis.pdf',
    documentType: 'lab_report',
    documentDate: '2026-08-15',
    uploadedAt: '2026-08-15T09:00:00.000Z',
    uploadedBy: 'Metropolis Healthcare Laboratory',
    facilityOrDoctor: 'Dr. Jasleen Kaur, MD (Pathology)',
    ocrConfidence: 99,
    isAiExtracted: true,
    fileUrl: createLabReportSvg({
      labName: 'METROPOLIS HEALTHCARE REFERENCE LAB - LUDHIANA',
      patientName: 'Gurpreet Singh',
      age: 70,
      gender: 'Male',
      date: '15 Aug 2026',
      sampleId: 'MET-GLU-5521',
      testTitle: 'Comprehensive Glycemic Index & Renal Diabetic Microalbumin Panel',
      results: [
        { test: 'Glycated Hemoglobin (HbA1c)', result: '9.2', unit: '%', range: '< 5.7% (Normal), < 7.0% (Goal)', status: 'critical' },
        { test: 'Estimated Average Glucose (eAG)', result: '217', unit: 'mg/dL', range: '< 154 mg/dL', status: 'critical' },
        { test: 'Fasting Plasma Glucose (FPG)', result: '198', unit: 'mg/dL', range: '70 - 100 mg/dL', status: 'critical' },
        { test: 'Postprandial Blood Glucose (PPBS)', result: '284', unit: 'mg/dL', range: '< 140 mg/dL', status: 'critical' },
        { test: 'Urine Microalbumin/Creatinine Ratio', result: '145.0', unit: 'mg/g', range: '< 30 mg/g (Normal)', status: 'high' },
        { test: 'Serum Creatinine', result: '1.2', unit: 'mg/dL', range: '0.7 - 1.3 mg/dL', status: 'normal' },
      ],
      impression:
        'Severely uncontrolled diabetes (HbA1c 9.2%). Microalbuminuria (145 mg/g) indicates early diabetic nephropathy. Escalation of anti-diabetic regimen strongly indicated along with ACE-inhibitor/ARB for renal protection.',
      pathologist: 'Dr. Jasleen Kaur, MD',
    }),
    extractedText: `METROPOLIS HEALTHCARE - DIABETIC PANEL
Patient: Gurpreet Singh | Age: 70 Y/M | Date: 15-Aug-2026
HbA1c: 9.2% (CRITICAL UNCONTROLLED: Diabetic Goal < 7.0%)
Fasting Blood Sugar: 198 mg/dL (High: 70-100)
Post Prandial Blood Sugar: 284 mg/dL (High: < 140)
Urine Albumin/Creatinine Ratio: 145 mg/g (High: Microalbuminuria stage 30-300 mg/g)
IMPRESSION: High glycemic burden with microvascular diabetic renal involvement.`,
    extractedData: {
      labResults: [
        { testName: 'HbA1c', value: '9.2', unit: '%', referenceRange: '< 7.0%', status: 'critical' },
        { testName: 'Fasting Blood Glucose', value: '198', unit: 'mg/dL', referenceRange: '70 - 100', status: 'critical' },
        { testName: 'Urine Microalbumin/Creatinine', value: '145', unit: 'mg/g', referenceRange: '< 30', status: 'high' },
      ],
      diagnoses: ['Uncontrolled Type 2 Diabetes Mellitus', 'Diabetic Nephropathy (Microalbuminuria)'],
    },
  },

  {
    id: 'doc-p5-rx',
    patientId: 'PAT-005',
    title: 'Endocrinology Prescription Slip (Metformin & Gliptin)',
    documentName: 'Endocrinology_Rx_DrGill.pdf',
    documentType: 'prescription',
    documentDate: '2026-08-01',
    uploadedAt: '2026-08-01T10:00:00.000Z',
    uploadedBy: 'Guru Teg Bahadur Hospital, Ludhiana',
    facilityOrDoctor: 'Dr. H. S. Gill, MD, DM (Endocrinology)',
    ocrConfidence: 97,
    isAiExtracted: true,
    fileUrl: createPrescriptionSvg({
      hospitalName: 'GURU TEG BAHADUR HOSPITAL & DIABETES CENTRE',
      doctorName: 'Dr. H. S. Gill, DM',
      specialty: 'Senior Consultant • Endocrinology & Metabolism',
      patientName: 'Gurpreet Singh',
      age: 70,
      gender: 'Male',
      date: '01 Aug 2026',
      rxId: 'RX-GTB-5521',
      diagnosis: 'Longstanding Type 2 Diabetes Mellitus with Distal Polyneuropathy',
      allergies: 'No Known Drug Allergies (NKDA)',
      medicines: [
        { name: 'Metformin 1000mg ER + Teneligliptin 20mg', dosage: '1 Tab', frequency: 'Twice daily after meals', duration: '60 days', instructions: 'Take with breakfast and dinner' },
        { name: 'Pregabalin 75mg + Methylcobalamin 1500mcg', dosage: '1 Cap', frequency: 'Once daily at bedtime', duration: '30 days', instructions: 'For foot burning and numbness' },
      ],
    }),
    extractedText: `GURU TEG BAHADUR HOSPITAL - DIABETES CLINIC
Patient: Gurpreet Singh | Age: 70/M | Date: 01-Aug-2026
Rx:
1. Tab Metformin 1000mg ER + Teneligliptin 20mg - 1 tab BD after meals
2. Cap Pregabalin 75mg + Methylcobalamin 1500mcg - 1 cap HS for neuropathy
Advised: Daily diabetic foot inspection. Avoid walking barefoot.`,
    extractedData: {
      medications: [
        { name: 'Metformin + Teneligliptin', dosage: '1000/20mg', frequency: 'BD' },
        { name: 'Pregabalin + Methylcobalamin', dosage: '75/1500mcg', frequency: 'HS' },
      ],
      diagnoses: ['Type 2 Diabetes', 'Diabetic Peripheral Neuropathy'],
    },
  },
];
