import { SupportedLanguage, LanguageCode } from '../types';

export const INDIAN_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    locale: 'en-IN',
    name: 'English',
    nativeName: 'English',
    englishName: 'English',
    direction: 'ltr',
    speechRecognitionLocale: 'en-IN',
    speechSynthesisLocale: 'en-IN',
    speechVoiceLang: 'en-IN',
    script: 'Latin',
    greeting: 'Namaste. I am your clinical voice assistant. Please tell me in your own words what health difficulties you are facing today.',
    isRtl: false,
    region: 'Pan-India / International',
    exampleQuery: 'I have had fever and cough for 3 days',
    listeningPrompt: 'Listening to your voice...',
    processingPrompt: 'Analyzing your response & medical context...',
  },
  {
    code: 'hi',
    locale: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    direction: 'ltr',
    speechRecognitionLocale: 'hi-IN',
    speechSynthesisLocale: 'hi-IN',
    speechVoiceLang: 'hi-IN',
    script: 'देवनागरी (Devanagari)',
    greeting: 'नमस्ते। मैं आपका स्वास्थ्य सहायक हूँ। कृपया बताइए आज आपको क्या तकलीफ़ या शारीरिक परेशानी हो रही है?',
    isRtl: false,
    region: 'North & Central India',
    exampleQuery: 'मुझे 3 दिनों से सीने में भारीपन और चक्कर आ रहे हैं',
    listeningPrompt: 'मैं सुन रहा हूँ... कृपया बोलिए',
    processingPrompt: 'मैं आपकी बात समझ रहा हूँ...',
  },
  {
    code: 'hinglish',
    locale: 'hi-IN',
    name: 'Hinglish',
    nativeName: 'Hinglish',
    englishName: 'Hinglish (Conversational Hindi in Latin script)',
    direction: 'ltr',
    speechRecognitionLocale: 'hi-IN',
    speechSynthesisLocale: 'hi-IN',
    speechVoiceLang: 'hi-IN',
    script: 'Latin',
    greeting: 'Namaste. Main aapki AI clinical nurse Ananya hoon. Aaj aapko kya pareshani ya sharirik takleef ho rahi hai? Kripya khul kar batayein.',
    isRtl: false,
    region: 'Pan-India',
    exampleQuery: 'Mujhe 3 din se fever hai aur sar dard ho raha hai',
    listeningPrompt: 'Main sun rahi hoon... Kripya boliye',
    processingPrompt: 'Aapki baat samajh rahi hoon...',
  },
  {
    code: 'bn',
    locale: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    direction: 'ltr',
    speechRecognitionLocale: 'bn-IN',
    speechSynthesisLocale: 'bn-IN',
    speechVoiceLang: 'bn-IN',
    script: 'বাংলা (Bengali)',
    greeting: 'নমস্কার। আমি আপনার ডিজিটাল স্বাস্থ্য সহায়ক। আজ আপনার কী ধরনের শারীরিক সমস্যা হচ্ছে দয়া করে বলুন।',
    isRtl: false,
    region: 'West Bengal & Tripura',
    exampleQuery: 'আমার গত কয়েকদিন ধরে বুকে ব্যথা এবং শ্বাসকষ্ট হচ্ছে',
    listeningPrompt: 'আমি শুনছি... অনুগ্রহ করে বলুন',
    processingPrompt: 'আপনার কথা পর্যালোচনা করছি...',
  },
  {
    code: 'mr',
    locale: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    direction: 'ltr',
    speechRecognitionLocale: 'mr-IN',
    speechSynthesisLocale: 'mr-IN',
    speechVoiceLang: 'mr-IN',
    script: 'देवनागरी (Devanagari)',
    greeting: 'नमस्कार. मी आपला क्लिनिकल आरोग्य सहाय्यक आहे. आज आपल्याला कोणती शारीरिक लक्षणे किंवा त्रास जाणवत आहे?',
    isRtl: false,
    region: 'Maharashtra',
    exampleQuery: 'मला दोन दिवसांपासून छातीत जळजळ आणि पोटात दुखत आहे',
    listeningPrompt: 'मी ऐकत आहे... कृपया बोला',
    processingPrompt: 'आपल्या लक्षणांचे विश्लेषण करत आहे...',
  },
  {
    code: 'te',
    locale: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    direction: 'ltr',
    speechRecognitionLocale: 'te-IN',
    speechSynthesisLocale: 'te-IN',
    speechVoiceLang: 'te-IN',
    script: 'తెలుగు (Telugu)',
    greeting: 'నమస్కారం. నేను మీ క్లినికల్ వాయిస్ సహాయకుడిని. ఈరోజు మీకు ఎలాంటి శారీరక ఇబ్బంది లేదా లక్షణాలు ఉన్నాయి?',
    isRtl: false,
    region: 'Andhra Pradesh & Telangana',
    exampleQuery: 'నాకు మూడు రోజులుగా గుండెల్లో మంట మరియు నడుము నొప్పిగా ఉంది',
    listeningPrompt: 'నేను వింటున్నాను... దయచేసి మాట్లాడండి',
    processingPrompt: 'మీ సమాధానాన్ని పరిశీలిస్తున్నాను...',
  },
  {
    code: 'ta',
    locale: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    direction: 'ltr',
    speechRecognitionLocale: 'ta-IN',
    speechSynthesisLocale: 'ta-IN',
    speechVoiceLang: 'ta-IN',
    script: 'தமிழ் (Tamil)',
    greeting: 'வணக்கம். நான் உங்கள் மருத்துவ குரல் உதவியாளர். இன்று உங்களுக்கு என்ன உடல்நல பிரச்சனை அல்லது வலி உள்ளது?',
    isRtl: false,
    region: 'Tamil Nadu & Puducherry',
    exampleQuery: 'எனக்கு சில நாட்களாக நெஞ்சு எரிச்சலும் தலைசுற்றலும் உள்ளது',
    listeningPrompt: 'நான் கேட்கிறேன்... தயவுசெய்து பேசுங்கள்',
    processingPrompt: 'உங்கள் தகவலைப் பதிவு செய்கிறேன்...',
  },
  {
    code: 'gu',
    locale: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    direction: 'ltr',
    speechRecognitionLocale: 'gu-IN',
    speechSynthesisLocale: 'gu-IN',
    speechVoiceLang: 'gu-IN',
    script: 'ગુજરાતી (Gujarati)',
    greeting: 'નમસ્તે. હું તમારો ક્લિનિકલ વૉઇસ સહાયક છું. આજે તમને શરીરમાં શું તકલીફ કે સમસ્યા થઈ રહી છે?',
    isRtl: false,
    region: 'Gujarat',
    exampleQuery: 'મને થોડા દિવસથી બ્લડ પ્રેશર અને ચક્કર જેવું લાગે છે',
    listeningPrompt: 'હું સાંભળી રહ્યો છું... કૃપા કરીને બોલો',
    processingPrompt: 'તમારી વિગતો સમજી રહ્યો છું...',
  },
  {
    code: 'kn',
    locale: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    direction: 'ltr',
    speechRecognitionLocale: 'kn-IN',
    speechSynthesisLocale: 'kn-IN',
    speechVoiceLang: 'kn-IN',
    script: 'ಕನ್ನಡ (Kannada)',
    greeting: 'ನಮಸ್ಕಾರ. ನಾನು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಧ್ವನಿ ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಆರೋಗ್ಯ ತೊಂದರೆ ಅಥವಾ ನೋವು ಇದೆ?',
    isRtl: false,
    region: 'Karnataka',
    exampleQuery: 'ನನಗೆ ಕಳೆದ ಮೂರು ದಿನಗಳಿಂದ ಎದೆ ಬಿಗಿತ ಮತ್ತು ಸುಸ್ತು ಅನಿಸುತ್ತಿದೆ',
    listeningPrompt: 'ನಾನು ಆಲಿಸುತ್ತಿದ್ದೇನೆ... ದಯವಿಟ್ಟು ಮಾತನಾಡಿ',
    processingPrompt: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
  },
  {
    code: 'ml',
    locale: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    direction: 'ltr',
    speechRecognitionLocale: 'ml-IN',
    speechSynthesisLocale: 'ml-IN',
    speechVoiceLang: 'ml-IN',
    script: 'മലയാളം (Malayalam)',
    greeting: 'നമസ്കാരം. ഞാൻ നിങ്ങളുടെ ക്ലിനിക്കൽ വോയ്‌സ് അസിസ്റ്റന്റാണ്. ഇന്ന് നിങ്ങൾക്ക് എന്തെങ്കിലും അസ്വസ്ഥതയോ രോഗലക്ഷണങ്ങളോ ഉണ്ടോ?',
    isRtl: false,
    region: 'Kerala',
    exampleQuery: 'എനിക്ക് കുറച്ചു ദിവസങ്ങളായി നെഞ്ചിൽ ഭാരവും ശ്വാസതടസ്സവും ഉണ്ട്',
    listeningPrompt: 'ഞാൻ കേൾക്കുന്നു... ദയവായി സംസാരിക്കുക',
    processingPrompt: 'വിവരങ്ങൾ പരിശോധിക്കുന്നു...',
  },
  {
    code: 'pa',
    locale: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    direction: 'ltr',
    speechRecognitionLocale: 'pa-IN',
    speechSynthesisLocale: 'pa-IN',
    speechVoiceLang: 'pa-IN',
    script: 'ਗੁਰਮੁਖੀ (Gurmukhi)',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਂ ਤੁਹਾਡਾ ਕਲੀਨਿਕਲ ਵੌਇਸ ਸਹਾਇਕ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਤਕਲੀਫ਼ ਜਾਂ ਸਿਹਤ ਸਮੱਸਿਆ ਹੈ?',
    isRtl: false,
    region: 'Punjab',
    exampleQuery: 'ਮੈਨੂੰ ਪਿਛਲੇ ਕੁਝ ਦਿਨਾਂ ਤੋਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਅਤੇ ਜੋੜਾਂ ਵਿੱਚ ਦਰਦ ਹੈ',
    listeningPrompt: 'ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਕਿਰਪਾ ਕਰਕੇ ਬੋਲੋ',
    processingPrompt: 'ਤੁਹਾਡੀ ਗੱਲ ਸਮਝ ਰਿਹਾ ਹਾਂ...',
  },
  {
    code: 'or',
    locale: 'or-IN',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    direction: 'ltr',
    speechRecognitionLocale: 'or-IN',
    speechSynthesisLocale: 'or-IN',
    speechVoiceLang: 'or-IN',
    script: 'ଓଡ଼ିଆ (Odia)',
    greeting: 'ନମସ୍କାର। ମୁଁ ଆପଣଙ୍କ ଡିଜିଟାଲ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆଜି ଆପଣଙ୍କୁ କେଉଁ ପ୍ରକାରର ଶାରୀରିକ ଅସୁବିଧା ହେଉଛି କୁହନ୍ତୁ।',
    isRtl: false,
    region: 'Odisha',
    exampleQuery: 'ମୋତେ ଦୁଇ ଦିନ ହେବ ଛାତିରେ ଯନ୍ତ୍ରଣା ଏବଂ କ୍ଳାନ୍ତି ଲାଗୁଛି',
    listeningPrompt: 'ମୁଁ ଶୁଣୁଛି... ଦୟାକରି କୁହନ୍ତୁ',
    processingPrompt: 'ତଥ୍ୟ ବିଶ୍ଳେଷଣ ଚାଲିଛି...',
  },
  {
    code: 'as',
    locale: 'as-IN',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    englishName: 'Assamese',
    direction: 'ltr',
    speechRecognitionLocale: 'as-IN',
    speechSynthesisLocale: 'as-IN',
    speechVoiceLang: 'as-IN',
    script: 'অসমীয়া (Assamese)',
    greeting: 'নমস্কাৰ। মই আপোনাৰ স্বাস্থ্য সহায়ক। আজি আপোনাৰ কিবা শাৰীৰিক সমস্যা বা অসুবিধা হৈছে নেকি কওক।',
    isRtl: false,
    region: 'Assam',
    exampleQuery: 'মোৰ কিছুদিন ধৰি উশাহ লোৱাত কষ্ট আৰু বিষ হৈ আছে',
    listeningPrompt: 'মই শুনি আছো... অনুগ্ৰহ কৰি কওক',
    processingPrompt: 'আপোনাৰ তথ্য সংগ্ৰহ কৰা হৈছে...',
  },
  {
    code: 'ur',
    locale: 'ur-IN',
    name: 'Urdu',
    nativeName: 'اردو',
    englishName: 'Urdu',
    direction: 'rtl',
    speechRecognitionLocale: 'ur-IN',
    speechSynthesisLocale: 'ur-IN',
    speechVoiceLang: 'ur-IN',
    script: 'اردو / نستعلیق (Nastaliq)',
    greeting: 'السلام علیکم۔ میں آپ کا کلینیکل وائس اسسٹنٹ ہوں۔ براہ کرم بتائیں آج آپ کو کیا جسمانی تکلیف یا مسئلہ ہے؟',
    isRtl: true,
    region: 'Pan-India / Jammu & Kashmir / Telangana / UP',
    exampleQuery: 'مجھے تین دن سے سینے میں گھٹن اور چکر آ رہے ہیں',
    listeningPrompt: 'میں سن رہا ہوں... براہ کرم بولیں',
    processingPrompt: 'آپ کی بات سمجھ رہا ہوں...',
  },
];

export function getLanguageByCode(code: string): SupportedLanguage {
  const normalized = (code || 'en').toLowerCase().trim();
  const match = INDIAN_LANGUAGES.find((lang) => lang.code === normalized || lang.speechVoiceLang.startsWith(normalized));
  return match || INDIAN_LANGUAGES[0];
}

export function isRtlLanguage(code: string): boolean {
  const lang = getLanguageByCode(code);
  return Boolean(lang.isRtl);
}

export function getLocalizedWelcomeGreeting(code: string, patientName?: string): string {
  const lang = (code || 'en').toLowerCase().trim();
  const name = patientName ? patientName.trim() : '';

  switch (lang) {
    case 'hi':
      return name
        ? `नमस्ते ${name} जी, मैं आपकी AI क्लिनिकल नर्स अनन्या हूँ। आज आपको क्या परेशानी या शारीरिक तकलीफ़ हो रही है? कृपया अपनी भाषा में खुलकर बताइए।`
        : 'नमस्ते, मैं आपकी AI क्लिनिकल नर्स अनन्या हूँ। आज आपको क्या परेशानी या शारीरिक तकलीफ़ हो रही है? कृपया अपनी भाषा में खुलकर बताइए।';
    case 'hinglish':
      return name
        ? `Namaste ${name} ji, main aapki AI clinical nurse Ananya hoon. Aaj aapko kya pareshani ya sharirik takleef ho rahi hai? Kripya apni bhasha me khul kar batayein.`
        : 'Namaste, main aapki AI clinical nurse Ananya hoon. Aaj aapko kya pareshani ya sharirik takleef ho rahi hai? Kripya apni bhasha me khul kar batayein.';
    case 'bn':
      return name
        ? `নমস্কার ${name} মহাশয়/মহাশয়া, আমি আপনার এআই ক্লিনিকাল নার্স অনন্যা। আজ আপনার কী ধরনের শারীরিক সমস্যা হচ্ছে? অনুগ্রহ করে আপনার ভাষায় বলুন।`
        : 'নমস্কার, আমি আপনার এআই ক্লিনিকাল নার্স অনন্যা। আজ আপনার কী ধরনের শারীরিক সমস্যা হচ্ছে? অনুগ্রহ করে আপনার ভাষায় বলুন।';
    case 'te':
      return name
        ? `నమస్కారం ${name} గారూ, నేను మీ AI క్లినికల్ నర్స్ అనన్యను. ఈరోజు మీకు ఎలాంటి శారీరక సమస్య లేదా అనారోగ్యం ఉంది? దయచేసి వివరంగా చెప్పండి.`
        : 'నమస్కారం, నేను మీ AI క్లినికల్ నర్స్ అనన్యను. ఈరోజు మీకు ఎలాంటి శారీరక సమస్య లేదా అనారోగ్యం ఉంది? దయచేసి వివరంగా చెప్పండి.';
    case 'ta':
      return name
        ? `வணக்கம் ${name} அவர்களே, நான் உங்கள் AI மருத்துவ நர்ஸ் அனன்யா. இன்று உங்களுக்கு என்ன உடல்நல பிரச்சனை உள்ளது? தயவுசெய்து விரிவாகக் கூறுங்கள்.`
        : 'வணக்கம், நான் உங்கள் AI மருத்துவ நர்ஸ் அனன்யா. இன்று உங்களுக்கு என்ன உடல்நல பிரச்சனை உள்ளது? தயவுசெய்து விரிவாகக் கூறுங்கள்.';
    case 'mr':
      return name
        ? `नमस्कार ${name} जी, मी तुमची AI क्लिनिकल नर्स अनन्या आहे. आज तुम्हाला काय त्रास किंवा शारीरिक अस्वस्थता होत आहे? कृपया तुमच्या भाषेत सांगा.`
        : 'नमस्कार, मी तुमची AI क्लिनिकल नर्स अनन्या आहे. आज तुम्हाला काय त्रास किंवा शारीरिक अस्वस्थता होत आहे? कृपया तुमच्या भाषेत सांगा.';
    case 'gu':
      return name
        ? `નમસ્તે ${name} જી, હું તમારી AI ક્લિનિકલ નર્સ અનન્યા છું. આજે તમને શું તકલીફ કે શારીરિક સમસ્યા થઈ રહી છે? કૃપા કરીને તમારી ભાષામાં જણાવો.`
        : 'નમસ્તે, હું તમારી AI ક્લિનિકલ નર્સ અનન્યા છું. આજે તમને શું તકલીફ કે શારીરિક સમસ્યા થઈ રહી છે? કૃપા કરીને તમારી ભાષામાં જણાવો.';
    case 'kn':
      return name
        ? `ನಮಸ್ಕಾರ ${name} ಅವರೇ, ನಾನು ನಿಮ್ಮ AI ಕ್ಲಿನಿಕಲ್ ನರ್ಸ್ ಅನನ್ಯ. ಇಂದು ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇದೆ? ದಯವಿಟ್ಟು ತಿಳಿಸಿ.`
        : 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ AI ಕ್ಲಿನಿಕಲ್ ನರ್ಸ್ ಅನನ್ಯ. ಇಂದು ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇದೆ? ದಯವಿಟ್ಟು ತಿಳಿಸಿ.';
    case 'ml':
      return name
        ? `നമസ്കാരം ${name}, ഞാൻ നിങ്ങളുടെ AI ക്ലിനിക്കൽ നേഴ്സ് അനന്യയാണ്. ഇന്ന് നിങ്ങൾക്ക് എന്തെങ്കിലും ആരോഗ്യ പ്രശ്നങ്ങളുണ്ടോ? ദയവായി പറയൂ.`
        : 'നമസ്കാരം, ഞാൻ നിങ്ങളുടെ AI ക്ലിനിക്കൽ നേഴ്സ് അനന്യയാണ്. ഇന്ന് നിങ്ങൾക്ക് എന്തെങ്കിലും ആരോഗ്യ പ്രശ്നങ്ങളുണ്ടോ? ദയവായി പറയൂ.';
    case 'pa':
      return name
        ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name} ਜੀ, ਮੈਂ ਤੁਹਾਡੀ AI ਕਲੀਨਿਕਲ ਨਰਸ ਅਨੰਨਿਆ ਹਾਂ। ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਤਕਲੀਫ਼ ਜਾਂ ਸਿਹਤ ਸਮੱਸਿਆ ਹੋ ਰਹੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ।`
        : 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਤੁਹਾਡੀ AI ਕਲੀਨਿਕਲ ਨਰਸ ਅਨੰਨਿਆ ਹਾਂ। ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਤਕਲੀਫ਼ ਜਾਂ ਸਿਹਤ ਸਮੱਸਿਆ ਹੋ ਰਹੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ।';
    case 'or':
      return name
        ? `ନମସ୍କାର ${name} ଆଜ୍ଞା, ମୁଁ ଆପଣଙ୍କ AI କ୍ଲିନିକାଲ ନର୍ସ ଅନନ୍ୟା। ଆଜି ଆପଣଙ୍କର କ’ଣ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ହେଉଛି? ଦୟାକରି କୁହନ୍ତୁ।`
        : 'ନମସ୍କାର, ମୁଁ ଆପଣଙ୍କ AI କ୍ଲିନିକାଲ ନର୍ସ ଅନନ୍ୟା। ଆଜି ଆପଣଙ୍କର କ’ଣ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ହେଉଛି? ଦୟାକରି କୁହନ୍ତୁ।';
    case 'as':
      return name
        ? `নমস্কাৰ ${name}, মই আপোনাৰ AI ক্লিনিকেল নাৰ্ছ অনন্যা। আজি আপোনাৰ কিবা শাৰীৰিক অসুবিধা হৈছে নেকি? অনুগ্ৰহ কৰি কওক।`
        : 'নমস্কাৰ, মই আপোনাৰ AI ক্লিনিকেল নাৰ্ছ অনন্যা। আজি আপোনাৰ কিবা শাৰীৰিক অসুবিধা হৈছে নেকি? অনুগ্ৰহ কৰি কওক।';
    case 'ur':
      return name
        ? `السلام علیکم ${name}، میں آپ کی AI کلینیکل نرس اننیا ہوں۔ آج آپ کو کیا تکلیف یا پریشانی ہو رہی ہے؟ براہ کرم تفصیل سے بتائیں۔`
        : 'السلام علیکم، میں آپ کی AI کلینیکل نرس اننیا ہوں۔ آج آپ کو کیا تکلیف یا پریشانی ہو رہی ہے؟ براہ کرم تفصیل से بتائیں۔';
    case 'en':
    default:
      return name
        ? `Hello ${name}, I am Nurse Ananya, your AI clinical intake nurse. How can I help you today? Please feel free to speak in your preferred language.`
        : 'Hello, I am Nurse Ananya, your AI clinical intake nurse. How can I help you today? Please feel free to speak in your preferred language.';
  }
}

export const SUPPORTED_LANGUAGES = INDIAN_LANGUAGES;
export const getLanguageConfig = getLanguageByCode;
export const DEFAULT_LANGUAGE: LanguageCode = 'en';
