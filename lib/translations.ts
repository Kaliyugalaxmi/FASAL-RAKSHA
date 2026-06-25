// ─────────────────────────────────────────────────────────
//  translations.ts  –  Static UI strings for 8 languages
// ─────────────────────────────────────────────────────────

export type LangCode = "en" | "hi" | "mr" | "te" | "ta" | "kn" | "pa" | "bn";

export interface Translations {
  // ── Common ──────────────────────────────────────────────
  continue: string;
  back: string;
  save: string;
  cancel: string;
  loading: string;
  error: string;
  retry: string;
  success: string;
  logout: string;
  yes: string;
  no: string;

  // ── Language Select ──────────────────────────────────────
  chooseLanguage: string;
  chooseLanguageSub: string;

  // ── Splash / Onboarding ──────────────────────────────────
  onboarding1Title: string;
  onboarding1Sub: string;
  onboarding2Title: string;
  onboarding2Sub: string;
  onboarding3Title: string;
  onboarding3Sub: string;
  getStarted: string;
  next: string;
  skip: string;

  // ── Auth ────────────────────────────────────────────────
  login: string;
  signup: string;
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  fullName: string;
  phone: string;
  loginSuccess: string;
  signupSuccess: string;
  invalidCredentials: string;

  // ── Dashboard / Home ────────────────────────────────────
  dashboard: string;
  welcomeBack: string;
  quickScan: string;
  recentScans: string;
  viewAll: string;
  healthyPlants: string;
  diseasesFound: string;
  totalScans: string;
  todayTip: string;

  // ── Scan ────────────────────────────────────────────────
  scanTitle: string;
  scanSubtitle: string;
  takePhoto: string;
  uploadPhoto: string;
  analyzing: string;
  analyzeSuccess: string;
  noImageSelected: string;

  // ── Crop Result ─────────────────────────────────────────
  cropResult: string;
  disease: string;
  confidence: string;
  treatment: string;
  prevention: string;
  severity: string;
  affectedArea: string;
  recommendations: string;
  saveResult: string;
  shareResult: string;
  healthy: string;
  diseased: string;

  // ── History ─────────────────────────────────────────────
  history: string;
  noHistory: string;
  noHistorySub: string;
  clearHistory: string;
  confirmClear: string;

  // ── Tips ────────────────────────────────────────────────
  tips: string;
  farmingTips: string;
  seasonalTips: string;
  pestManagement: string;

  // ── Explore ─────────────────────────────────────────────
  explore: string;
  searchCrops: string;
  popularCrops: string;
  allDiseases: string;

  // ── Profile ─────────────────────────────────────────────
  profile: string;
  editProfile: string;
  language: string;
  notifications: string;
  help: string;
  about: string;
  version: string;
  farmName: string;
  location: string;
}

// ─────────────────────────────────────────────────────────
const en: Translations = {
  continue: "Continue",
  back: "Back",
  save: "Save",
  cancel: "Cancel",
  loading: "Loading...",
  error: "Something went wrong",
  retry: "Retry",
  success: "Success",
  logout: "Logout",
  yes: "Yes",
  no: "No",

  chooseLanguage: "Choose Your\nLanguage",
  chooseLanguageSub: "Select your preferred language to customize your farming experience.",

  onboarding1Title: "Detect Crop Diseases",
  onboarding1Sub: "Instantly identify diseases in your crops using AI-powered image analysis.",
  onboarding2Title: "Get Expert Advice",
  onboarding2Sub: "Receive tailored treatment and prevention recommendations for every disease.",
  onboarding3Title: "Grow Better, Earn More",
  onboarding3Sub: "Stay ahead of diseases and maximize your harvest with smart insights.",
  getStarted: "Get Started",
  next: "Next",
  skip: "Skip",

  login: "Login",
  signup: "Sign Up",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  forgotPassword: "Forgot Password?",
  fullName: "Full Name",
  phone: "Phone Number",
  loginSuccess: "Logged in successfully",
  signupSuccess: "Account created successfully",
  invalidCredentials: "Invalid email or password",

  dashboard: "Dashboard",
  welcomeBack: "Welcome back",
  quickScan: "Quick Scan",
  recentScans: "Recent Scans",
  viewAll: "View All",
  healthyPlants: "Healthy Plants",
  diseasesFound: "Diseases Found",
  totalScans: "Total Scans",
  todayTip: "Tip of the Day",

  scanTitle: "Scan Your Crop",
  scanSubtitle: "Take or upload a photo of the affected leaf or plant",
  takePhoto: "Take Photo",
  uploadPhoto: "Upload Photo",
  analyzing: "Analyzing your crop...",
  analyzeSuccess: "Analysis complete",
  noImageSelected: "Please select an image first",

  cropResult: "Crop Result",
  disease: "Disease",
  confidence: "Confidence",
  treatment: "Treatment",
  prevention: "Prevention",
  severity: "Severity",
  affectedArea: "Affected Area",
  recommendations: "Recommendations",
  saveResult: "Save Result",
  shareResult: "Share",
  healthy: "Healthy",
  diseased: "Diseased",

  history: "History",
  noHistory: "No Scans Yet",
  noHistorySub: "Your scan history will appear here",
  clearHistory: "Clear History",
  confirmClear: "Are you sure you want to clear all history?",

  tips: "Tips",
  farmingTips: "Farming Tips",
  seasonalTips: "Seasonal Tips",
  pestManagement: "Pest Management",

  explore: "Explore",
  searchCrops: "Search crops or diseases...",
  popularCrops: "Popular Crops",
  allDiseases: "All Diseases",

  profile: "Profile",
  editProfile: "Edit Profile",
  language: "Language",
  notifications: "Notifications",
  help: "Help & Support",
  about: "About",
  version: "Version",
  farmName: "Farm Name",
  location: "Location",
};

// ─────────────────────────────────────────────────────────
const hi: Translations = {
  continue: "जारी रखें",
  back: "वापस",
  save: "सहेजें",
  cancel: "रद्द करें",
  loading: "लोड हो रहा है...",
  error: "कुछ गलत हो गया",
  retry: "फिर कोशिश करें",
  success: "सफलता",
  logout: "लॉगआउट",
  yes: "हाँ",
  no: "नहीं",

  chooseLanguage: "अपनी भाषा\nचुनें",
  chooseLanguageSub: "अपनी कृषि अनुभव को अनुकूलित करने के लिए भाषा चुनें।",

  onboarding1Title: "फसल रोग पहचानें",
  onboarding1Sub: "AI तकनीक से अपनी फसल में रोग तुरंत पहचानें।",
  onboarding2Title: "विशेषज्ञ सलाह पाएं",
  onboarding2Sub: "हर रोग के लिए उपचार और बचाव की सलाह पाएं।",
  onboarding3Title: "बेहतर उगाएं, अधिक कमाएं",
  onboarding3Sub: "स्मार्ट जानकारी से फसल को बचाएं और उत्पादन बढ़ाएं।",
  getStarted: "शुरू करें",
  next: "आगे",
  skip: "छोड़ें",

  login: "लॉगिन",
  signup: "साइन अप",
  email: "ईमेल",
  password: "पासवर्ड",
  confirmPassword: "पासवर्ड की पुष्टि करें",
  forgotPassword: "पासवर्ड भूल गए?",
  fullName: "पूरा नाम",
  phone: "फोन नंबर",
  loginSuccess: "सफलतापूर्वक लॉगिन हुआ",
  signupSuccess: "खाता सफलतापूर्वक बनाया गया",
  invalidCredentials: "ईमेल या पासवर्ड गलत है",

  dashboard: "डैशबोर्ड",
  welcomeBack: "वापस आने पर स्वागत है",
  quickScan: "त्वरित स्कैन",
  recentScans: "हाल के स्कैन",
  viewAll: "सभी देखें",
  healthyPlants: "स्वस्थ पौधे",
  diseasesFound: "रोग पाए गए",
  totalScans: "कुल स्कैन",
  todayTip: "आज की सलाह",

  scanTitle: "अपनी फसल स्कैन करें",
  scanSubtitle: "प्रभावित पत्ती या पौधे की फोटो लें या अपलोड करें",
  takePhoto: "फोटो लें",
  uploadPhoto: "फोटो अपलोड करें",
  analyzing: "आपकी फसल का विश्लेषण हो रहा है...",
  analyzeSuccess: "विश्लेषण पूर्ण",
  noImageSelected: "कृपया पहले एक छवि चुनें",

  cropResult: "फसल परिणाम",
  disease: "रोग",
  confidence: "सटीकता",
  treatment: "उपचार",
  prevention: "बचाव",
  severity: "गंभीरता",
  affectedArea: "प्रभावित क्षेत्र",
  recommendations: "सिफारिशें",
  saveResult: "परिणाम सहेजें",
  shareResult: "शेयर करें",
  healthy: "स्वस्थ",
  diseased: "रोगग्रस्त",

  history: "इतिहास",
  noHistory: "अभी कोई स्कैन नहीं",
  noHistorySub: "आपका स्कैन इतिहास यहाँ दिखेगा",
  clearHistory: "इतिहास साफ करें",
  confirmClear: "क्या आप सारा इतिहास हटाना चाहते हैं?",

  tips: "सुझाव",
  farmingTips: "खेती के सुझाव",
  seasonalTips: "मौसमी सुझाव",
  pestManagement: "कीट प्रबंधन",

  explore: "एक्सप्लोर",
  searchCrops: "फसल या रोग खोजें...",
  popularCrops: "लोकप्रिय फसलें",
  allDiseases: "सभी रोग",

  profile: "प्रोफ़ाइल",
  editProfile: "प्रोफ़ाइल संपादित करें",
  language: "भाषा",
  notifications: "सूचनाएं",
  help: "सहायता",
  about: "के बारे में",
  version: "संस्करण",
  farmName: "खेत का नाम",
  location: "स्थान",
};

// ─────────────────────────────────────────────────────────
const mr: Translations = {
  continue: "पुढे सुरू ठेवा",
  back: "मागे",
  save: "जतन करा",
  cancel: "रद्द करा",
  loading: "लोड होत आहे...",
  error: "काहीतरी चुकले",
  retry: "पुन्हा प्रयत्न करा",
  success: "यश",
  logout: "लॉगआउट",
  yes: "हो",
  no: "नाही",

  chooseLanguage: "तुमची भाषा\nनिवडा",
  chooseLanguageSub: "तुमचा शेती अनुभव सुधारण्यासाठी भाषा निवडा.",

  onboarding1Title: "पीक रोग शोधा",
  onboarding1Sub: "AI तंत्रज्ञानाने तुमच्या पिकातील रोग त्वरित ओळखा.",
  onboarding2Title: "तज्ञ सल्ला मिळवा",
  onboarding2Sub: "प्रत्येक रोगासाठी उपचार आणि प्रतिबंध शिफारसी मिळवा.",
  onboarding3Title: "चांगले वाढवा, जास्त कमवा",
  onboarding3Sub: "स्मार्ट माहितीने पीक वाचवा आणि उत्पादन वाढवा.",
  getStarted: "सुरुवात करा",
  next: "पुढे",
  skip: "वगळा",

  login: "लॉगिन",
  signup: "नोंदणी करा",
  email: "ईमेल",
  password: "पासवर्ड",
  confirmPassword: "पासवर्ड पुष्टी करा",
  forgotPassword: "पासवर्ड विसरलात?",
  fullName: "पूर्ण नाव",
  phone: "फोन नंबर",
  loginSuccess: "यशस्वीरित्या लॉगिन झाले",
  signupSuccess: "खाते यशस्वीरित्या तयार झाले",
  invalidCredentials: "चुकीचा ईमेल किंवा पासवर्ड",

  dashboard: "डॅशबोर्ड",
  welcomeBack: "परत आल्याबद्दल स्वागत",
  quickScan: "झटपट स्कॅन",
  recentScans: "अलीकडील स्कॅन",
  viewAll: "सर्व पहा",
  healthyPlants: "निरोगी झाडे",
  diseasesFound: "रोग आढळले",
  totalScans: "एकूण स्कॅन",
  todayTip: "आजचा सल्ला",

  scanTitle: "तुमचे पीक स्कॅन करा",
  scanSubtitle: "बाधित पान किंवा झाडाचा फोटो घ्या किंवा अपलोड करा",
  takePhoto: "फोटो घ्या",
  uploadPhoto: "फोटो अपलोड करा",
  analyzing: "तुमच्या पिकाचे विश्लेषण होत आहे...",
  analyzeSuccess: "विश्लेषण पूर्ण",
  noImageSelected: "कृपया आधी प्रतिमा निवडा",

  cropResult: "पीक परिणाम",
  disease: "रोग",
  confidence: "अचूकता",
  treatment: "उपचार",
  prevention: "प्रतिबंध",
  severity: "तीव्रता",
  affectedArea: "बाधित क्षेत्र",
  recommendations: "शिफारसी",
  saveResult: "परिणाम जतन करा",
  shareResult: "शेअर करा",
  healthy: "निरोगी",
  diseased: "रोगग्रस्त",

  history: "इतिहास",
  noHistory: "अद्याप स्कॅन नाही",
  noHistorySub: "तुमचा स्कॅन इतिहास येथे दिसेल",
  clearHistory: "इतिहास साफ करा",
  confirmClear: "तुम्हाला सर्व इतिहास हटवायचा आहे का?",

  tips: "टिप्स",
  farmingTips: "शेती टिप्स",
  seasonalTips: "हंगामी टिप्स",
  pestManagement: "कीड व्यवस्थापन",

  explore: "शोधा",
  searchCrops: "पीक किंवा रोग शोधा...",
  popularCrops: "लोकप्रिय पिके",
  allDiseases: "सर्व रोग",

  profile: "प्रोफाइल",
  editProfile: "प्रोफाइल संपादित करा",
  language: "भाषा",
  notifications: "सूचना",
  help: "मदत",
  about: "बद्दल",
  version: "आवृत्ती",
  farmName: "शेताचे नाव",
  location: "स्थान",
};

// ─────────────────────────────────────────────────────────
const te: Translations = {
  continue: "కొనసాగించు",
  back: "వెనుక",
  save: "సేవ్ చేయి",
  cancel: "రద్దు చేయి",
  loading: "లోడవుతోంది...",
  error: "ఏదో తప్పు జరిగింది",
  retry: "మళ్లీ ప్రయత్నించు",
  success: "విజయం",
  logout: "లాగ్అవుట్",
  yes: "అవును",
  no: "లేదు",

  chooseLanguage: "మీ భాషను\nఎంచుకోండి",
  chooseLanguageSub: "మీ వ్యవసాయ అనుభవాన్ని మెరుగుపరచుకోవడానికి భాషను ఎంచుకోండి.",

  onboarding1Title: "పంట వ్యాధులను గుర్తించండి",
  onboarding1Sub: "AI సాంకేతికతను ఉపయోగించి మీ పంటలో వ్యాధులను తక్షణమే గుర్తించండి.",
  onboarding2Title: "నిపుణుల సలహా పొందండి",
  onboarding2Sub: "ప్రతి వ్యాధికి చికిత్స మరియు నివారణ సిఫార్సులు పొందండి.",
  onboarding3Title: "మెరుగ్గా పెంచండి, ఎక్కువ సంపాదించండి",
  onboarding3Sub: "స్మార్ట్ సమాచారంతో పంటను రక్షించండి.",
  getStarted: "ప్రారంభించండి",
  next: "తదుపరి",
  skip: "దాటవేయి",

  login: "లాగిన్",
  signup: "సైన్ అప్",
  email: "ఇమెయిల్",
  password: "పాస్‌వర్డ్",
  confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
  forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
  fullName: "పూర్తి పేరు",
  phone: "ఫోన్ నంబర్",
  loginSuccess: "విజయవంతంగా లాగిన్ అయింది",
  signupSuccess: "ఖాతా విజయవంతంగా సృష్టించబడింది",
  invalidCredentials: "తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్",

  dashboard: "డాష్‌బోర్డ్",
  welcomeBack: "తిరిగి స్వాగతం",
  quickScan: "త్వరిత స్కాన్",
  recentScans: "ఇటీవలి స్కాన్లు",
  viewAll: "అన్నీ చూడు",
  healthyPlants: "ఆరోగ్యకరమైన మొక్కలు",
  diseasesFound: "వ్యాధులు కనుగొనబడ్డాయి",
  totalScans: "మొత్తం స్కాన్లు",
  todayTip: "నేటి చిట్కా",

  scanTitle: "మీ పంటను స్కాన్ చేయండి",
  scanSubtitle: "ప్రభావిత ఆకు లేదా మొక్క ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి",
  takePhoto: "ఫోటో తీయండి",
  uploadPhoto: "ఫోటో అప్‌లోడ్ చేయండి",
  analyzing: "మీ పంటను విశ్లేషిస్తోంది...",
  analyzeSuccess: "విశ్లేషణ పూర్తయింది",
  noImageSelected: "దయచేసి మొదట చిత్రాన్ని ఎంచుకోండి",

  cropResult: "పంట ఫలితం",
  disease: "వ్యాధి",
  confidence: "నిర్ధారత",
  treatment: "చికిత్స",
  prevention: "నివారణ",
  severity: "తీవ్రత",
  affectedArea: "ప్రభావిత ప్రాంతం",
  recommendations: "సిఫార్సులు",
  saveResult: "ఫలితం సేవ్ చేయి",
  shareResult: "షేర్ చేయి",
  healthy: "ఆరోగ్యకరమైన",
  diseased: "వ్యాధిగ్రస్తమైన",

  history: "చరిత్ర",
  noHistory: "ఇంకా స్కాన్లు లేవు",
  noHistorySub: "మీ స్కాన్ చరిత్ర ఇక్కడ కనిపిస్తుంది",
  clearHistory: "చరిత్ర తీసివేయండి",
  confirmClear: "మీరు అన్ని చరిత్రను తొలగించాలనుకుంటున్నారా?",

  tips: "చిట్కాలు",
  farmingTips: "వ్యవసాయ చిట్కాలు",
  seasonalTips: "సీజనల్ చిట్కాలు",
  pestManagement: "పురుగుల నిర్వహణ",

  explore: "అన్వేషించు",
  searchCrops: "పంటలు లేదా వ్యాధులు వెతకండి...",
  popularCrops: "ప్రసిద్ధ పంటలు",
  allDiseases: "అన్ని వ్యాధులు",

  profile: "ప్రొఫైల్",
  editProfile: "ప్రొఫైల్ సవరించు",
  language: "భాష",
  notifications: "నోటిఫికేషన్లు",
  help: "సహాయం",
  about: "గురించి",
  version: "వెర్షన్",
  farmName: "పొలం పేరు",
  location: "స్థానం",
};

// ─────────────────────────────────────────────────────────
const ta: Translations = {
  continue: "தொடரவும்",
  back: "பின்னால்",
  save: "சேமி",
  cancel: "ரத்து செய்",
  loading: "ஏற்றுகிறது...",
  error: "ஏதோ தவறு நடந்தது",
  retry: "மீண்டும் முயற்சி",
  success: "வெற்றி",
  logout: "வெளியேறு",
  yes: "ஆம்",
  no: "இல்லை",

  chooseLanguage: "உங்கள் மொழியை\nதேர்வு செய்யுங்கள்",
  chooseLanguageSub: "உங்கள் விவசாய அனுபவை தனிப்பயனாக்க மொழியை தேர்வு செய்யுங்கள்.",

  onboarding1Title: "பயிர் நோய்களை கண்டறியுங்கள்",
  onboarding1Sub: "AI தொழில்நுட்பம் மூலம் உங்கள் பயிரில் நோய்களை உடனடியாக கண்டறியுங்கள்.",
  onboarding2Title: "நிபுணர் ஆலோசனை பெறுங்கள்",
  onboarding2Sub: "ஒவ்வொரு நோய்க்கும் சிகிச்சை பரிந்துரைகள் பெறுங்கள்.",
  onboarding3Title: "சிறப்பாக வளர்க்கவும், அதிகம் சம்பாதிக்கவும்",
  onboarding3Sub: "திறமையான தகவல்களால் பயிரை பாதுகாத்து உற்பத்தி அதிகரிக்கவும்.",
  getStarted: "தொடங்குங்கள்",
  next: "அடுத்து",
  skip: "தவிர்",

  login: "உள்நுழை",
  signup: "பதிவு செய்",
  email: "மின்னஞ்சல்",
  password: "கடவுச்சொல்",
  confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
  forgotPassword: "கடவுச்சொல் மறந்தீர்களா?",
  fullName: "முழு பெயர்",
  phone: "தொலைபேசி எண்",
  loginSuccess: "வெற்றிகரமாக உள்நுழைந்தீர்கள்",
  signupSuccess: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
  invalidCredentials: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",

  dashboard: "டாஷ்போர்டு",
  welcomeBack: "மீண்டும் வரவேற்கிறோம்",
  quickScan: "விரைவு ஸ்கேன்",
  recentScans: "சமீபத்திய ஸ்கேன்கள்",
  viewAll: "அனைத்தையும் பார்க்க",
  healthyPlants: "ஆரோக்கியமான செடிகள்",
  diseasesFound: "நோய்கள் கண்டறியப்பட்டன",
  totalScans: "மொத்த ஸ்கேன்கள்",
  todayTip: "இன்றைய குறிப்பு",

  scanTitle: "உங்கள் பயிரை ஸ்கேன் செய்யுங்கள்",
  scanSubtitle: "பாதிக்கப்பட்ட இலை அல்லது தாவரத்தின் புகைப்படம் எடுங்கள்",
  takePhoto: "புகைப்படம் எடு",
  uploadPhoto: "புகைப்படம் பதிவேற்றவும்",
  analyzing: "உங்கள் பயிரை பகுப்பாய்வு செய்கிறோம்...",
  analyzeSuccess: "பகுப்பாய்வு நிறைவடைந்தது",
  noImageSelected: "முதலில் படத்தை தேர்ந்தெடுக்கவும்",

  cropResult: "பயிர் முடிவு",
  disease: "நோய்",
  confidence: "நம்பகத்தன்மை",
  treatment: "சிகிச்சை",
  prevention: "தடுப்பு",
  severity: "தீவிரம்",
  affectedArea: "பாதிக்கப்பட்ட பகுதி",
  recommendations: "பரிந்துரைகள்",
  saveResult: "முடிவை சேமி",
  shareResult: "பகிர்",
  healthy: "ஆரோக்கியமான",
  diseased: "நோய்வாய்ப்பட்ட",

  history: "வரலாறு",
  noHistory: "இன்னும் ஸ்கேன்கள் இல்லை",
  noHistorySub: "உங்கள் ஸ்கேன் வரலாறு இங்கே காண்பிக்கப்படும்",
  clearHistory: "வரலாற்றை அழி",
  confirmClear: "அனைத்து வரலாற்றையும் அழிக்க விரும்புகிறீர்களா?",

  tips: "குறிப்புகள்",
  farmingTips: "விவசாய குறிப்புகள்",
  seasonalTips: "பருவகால குறிப்புகள்",
  pestManagement: "பூச்சி மேலாண்மை",

  explore: "ஆராய்",
  searchCrops: "பயிர்கள் அல்லது நோய்களை தேடுங்கள்...",
  popularCrops: "பிரபலமான பயிர்கள்",
  allDiseases: "அனைத்து நோய்கள்",

  profile: "சுயவிவரம்",
  editProfile: "சுயவிவரம் திருத்து",
  language: "மொழி",
  notifications: "அறிவிப்புகள்",
  help: "உதவி",
  about: "பற்றி",
  version: "பதிப்பு",
  farmName: "பண்ணை பெயர்",
  location: "இடம்",
};

// ─────────────────────────────────────────────────────────
const kn: Translations = {
  continue: "ಮುಂದುವರಿಸಿ",
  back: "ಹಿಂದೆ",
  save: "ಉಳಿಸಿ",
  cancel: "ರದ್ದು ಮಾಡಿ",
  loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
  error: "ಏನೋ ತಪ್ಪಾಯಿತು",
  retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  success: "ಯಶಸ್ಸು",
  logout: "ಲಾಗ್‌ಔಟ್",
  yes: "ಹೌದು",
  no: "ಇಲ್ಲ",

  chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು\nಆಯ್ಕೆಮಾಡಿ",
  chooseLanguageSub: "ನಿಮ್ಮ ಕೃಷಿ ಅನುಭವ ಸುಧಾರಿಸಲು ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ.",

  onboarding1Title: "ಬೆಳೆ ರೋಗಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ",
  onboarding1Sub: "AI ತಂತ್ರಜ್ಞಾನ ಬಳಸಿ ನಿಮ್ಮ ಬೆಳೆಯಲ್ಲಿ ರೋಗಗಳನ್ನು ತಕ್ಷಣ ಪತ್ತೆ ಮಾಡಿ.",
  onboarding2Title: "ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ",
  onboarding2Sub: "ಪ್ರತಿ ರೋಗಕ್ಕೆ ಚಿಕಿತ್ಸೆ ಮತ್ತು ತಡೆಗಟ್ಟುವ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ.",
  onboarding3Title: "ಉತ್ತಮವಾಗಿ ಬೆಳೆಸಿ, ಹೆಚ್ಚು ಗಳಿಸಿ",
  onboarding3Sub: "ಸ್ಮಾರ್ಟ್ ಮಾಹಿತಿಯಿಂದ ಬೆಳೆ ರಕ್ಷಿಸಿ ಮತ್ತು ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಿ.",
  getStarted: "ಪ್ರಾರಂಭಿಸಿ",
  next: "ಮುಂದೆ",
  skip: "ಬಿಟ್ಟು ಬಿಡಿ",

  login: "ಲಾಗಿನ್",
  signup: "ಸೈನ್ ಅಪ್",
  email: "ಇಮೇಲ್",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  fullName: "ಪೂರ್ಣ ಹೆಸರು",
  phone: "ಫೋನ್ ನಂಬರ್",
  loginSuccess: "ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಯಿತು",
  signupSuccess: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ",
  invalidCredentials: "ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",

  dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ",
  quickScan: "ತ್ವರಿತ ಸ್ಕ್ಯಾನ್",
  recentScans: "ಇತ್ತೀಚಿನ ಸ್ಕ್ಯಾನ್‌ಗಳು",
  viewAll: "ಎಲ್ಲ ನೋಡಿ",
  healthyPlants: "ಆರೋಗ್ಯಕರ ಸಸ್ಯಗಳು",
  diseasesFound: "ರೋಗಗಳು ಕಂಡುಬಂದಿವೆ",
  totalScans: "ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು",
  todayTip: "ಇಂದಿನ ಸಲಹೆ",

  scanTitle: "ನಿಮ್ಮ ಬೆಳೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
  scanSubtitle: "ಬಾಧಿತ ಎಲೆ ಅಥವಾ ಸಸ್ಯದ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
  uploadPhoto: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  analyzing: "ನಿಮ್ಮ ಬೆಳೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
  analyzeSuccess: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
  noImageSelected: "ದಯವಿಟ್ಟು ಮೊದಲು ಚಿತ್ರ ಆಯ್ಕೆ ಮಾಡಿ",

  cropResult: "ಬೆಳೆ ಫಲಿತಾಂಶ",
  disease: "ರೋಗ",
  confidence: "ನಿಖರತೆ",
  treatment: "ಚಿಕಿತ್ಸೆ",
  prevention: "ತಡೆಗಟ್ಟುವಿಕೆ",
  severity: "ತೀವ್ರತೆ",
  affectedArea: "ಬಾಧಿತ ಪ್ರದೇಶ",
  recommendations: "ಶಿಫಾರಸುಗಳು",
  saveResult: "ಫಲಿತಾಂಶ ಉಳಿಸಿ",
  shareResult: "ಹಂಚಿಕೊಳ್ಳಿ",
  healthy: "ಆರೋಗ್ಯಕರ",
  diseased: "ರೋಗಗ್ರಸ್ತ",

  history: "ಇತಿಹಾಸ",
  noHistory: "ಇನ್ನೂ ಸ್ಕ್ಯಾನ್ ಇಲ್ಲ",
  noHistorySub: "ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸ ಇಲ್ಲಿ ತೋರಿಸುತ್ತದೆ",
  clearHistory: "ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ",
  confirmClear: "ಎಲ್ಲಾ ಇತಿಹಾಸ ಅಳಿಸಲು ಬಯಸುತ್ತೀರಾ?",

  tips: "ಸಲಹೆಗಳು",
  farmingTips: "ಕೃಷಿ ಸಲಹೆಗಳು",
  seasonalTips: "ಋತು ಸಲಹೆಗಳು",
  pestManagement: "ಕೀಟ ನಿರ್ವಹಣೆ",

  explore: "ಅನ್ವೇಷಿಸಿ",
  searchCrops: "ಬೆಳೆಗಳು ಅಥವಾ ರೋಗಗಳನ್ನು ಹುಡುಕಿ...",
  popularCrops: "ಜನಪ್ರಿಯ ಬೆಳೆಗಳು",
  allDiseases: "ಎಲ್ಲಾ ರೋಗಗಳು",

  profile: "ಪ್ರೊಫೈಲ್",
  editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
  language: "ಭಾಷೆ",
  notifications: "ಅಧಿಸೂಚನೆಗಳು",
  help: "ಸಹಾಯ",
  about: "ಬಗ್ಗೆ",
  version: "ಆವೃತ್ತಿ",
  farmName: "ಜಮೀನಿನ ಹೆಸರು",
  location: "ಸ್ಥಳ",
};

// ─────────────────────────────────────────────────────────
const pa: Translations = {
  continue: "ਜਾਰੀ ਰੱਖੋ",
  back: "ਵਾਪਸ",
  save: "ਸੇਵ ਕਰੋ",
  cancel: "ਰੱਦ ਕਰੋ",
  loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
  error: "ਕੁਝ ਗਲਤ ਹੋਇਆ",
  retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  success: "ਸਫਲਤਾ",
  logout: "ਲੌਗਆਉਟ",
  yes: "ਹਾਂ",
  no: "ਨਹੀਂ",

  chooseLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ\nਚੁਣੋ",
  chooseLanguageSub: "ਆਪਣੇ ਖੇਤੀਬਾੜੀ ਅਨੁਭਵ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ।",

  onboarding1Title: "ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦਾ ਪਤਾ ਲਗਾਓ",
  onboarding1Sub: "AI ਤਕਨੀਕ ਨਾਲ ਆਪਣੀ ਫਸਲ ਵਿੱਚ ਬਿਮਾਰੀਆਂ ਦਾ ਤੁਰੰਤ ਪਤਾ ਲਗਾਓ।",
  onboarding2Title: "ਮਾਹਿਰ ਸਲਾਹ ਲਓ",
  onboarding2Sub: "ਹਰ ਬਿਮਾਰੀ ਲਈ ਇਲਾਜ ਅਤੇ ਬਚਾਅ ਦੀਆਂ ਸਿਫਾਰਿਸ਼ਾਂ ਲਓ।",
  onboarding3Title: "ਵਧੀਆ ਉਗਾਓ, ਜ਼ਿਆਦਾ ਕਮਾਓ",
  onboarding3Sub: "ਸਮਾਰਟ ਜਾਣਕਾਰੀ ਨਾਲ ਫਸਲ ਬਚਾਓ ਅਤੇ ਉਤਪਾਦਨ ਵਧਾਓ।",
  getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
  next: "ਅਗਲਾ",
  skip: "ਛੱਡੋ",

  login: "ਲੌਗਇਨ",
  signup: "ਸਾਈਨ ਅੱਪ",
  email: "ਈਮੇਲ",
  password: "ਪਾਸਵਰਡ",
  confirmPassword: "ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ ਕਰੋ",
  forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
  fullName: "ਪੂਰਾ ਨਾਮ",
  phone: "ਫੋਨ ਨੰਬਰ",
  loginSuccess: "ਸਫਲਤਾਪੂਰਵਕ ਲੌਗਇਨ ਹੋਇਆ",
  signupSuccess: "ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ",
  invalidCredentials: "ਗਲਤ ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ",

  dashboard: "ਡੈਸ਼ਬੋਰਡ",
  welcomeBack: "ਵਾਪਸ ਆਉਣ ਦਾ ਸੁਆਗਤ ਹੈ",
  quickScan: "ਤੇਜ਼ ਸਕੈਨ",
  recentScans: "ਹਾਲ ਹੀ ਦੇ ਸਕੈਨ",
  viewAll: "ਸਭ ਦੇਖੋ",
  healthyPlants: "ਸਿਹਤਮੰਦ ਪੌਦੇ",
  diseasesFound: "ਬਿਮਾਰੀਆਂ ਮਿਲੀਆਂ",
  totalScans: "ਕੁੱਲ ਸਕੈਨ",
  todayTip: "ਅੱਜ ਦੀ ਸਲਾਹ",

  scanTitle: "ਆਪਣੀ ਫਸਲ ਸਕੈਨ ਕਰੋ",
  scanSubtitle: "ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਜਾਂ ਪੌਦੇ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਅਪਲੋਡ ਕਰੋ",
  takePhoto: "ਫੋਟੋ ਲਓ",
  uploadPhoto: "ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
  analyzing: "ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
  analyzeSuccess: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ",
  noImageSelected: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਚਿੱਤਰ ਚੁਣੋ",

  cropResult: "ਫਸਲ ਦਾ ਨਤੀਜਾ",
  disease: "ਬਿਮਾਰੀ",
  confidence: "ਸਟੀਕਤਾ",
  treatment: "ਇਲਾਜ",
  prevention: "ਬਚਾਅ",
  severity: "ਗੰਭੀਰਤਾ",
  affectedArea: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ",
  recommendations: "ਸਿਫਾਰਿਸ਼ਾਂ",
  saveResult: "ਨਤੀਜਾ ਸੇਵ ਕਰੋ",
  shareResult: "ਸ਼ੇਅਰ ਕਰੋ",
  healthy: "ਸਿਹਤਮੰਦ",
  diseased: "ਬਿਮਾਰ",

  history: "ਇਤਿਹਾਸ",
  noHistory: "ਅਜੇ ਕੋਈ ਸਕੈਨ ਨਹੀਂ",
  noHistorySub: "ਤੁਹਾਡਾ ਸਕੈਨ ਇਤਿਹਾਸ ਇੱਥੇ ਦਿਖੇਗਾ",
  clearHistory: "ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ",
  confirmClear: "ਕੀ ਤੁਸੀਂ ਸਾਰਾ ਇਤਿਹਾਸ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",

  tips: "ਸੁਝਾਅ",
  farmingTips: "ਖੇਤੀਬਾੜੀ ਸੁਝਾਅ",
  seasonalTips: "ਮੌਸਮੀ ਸੁਝਾਅ",
  pestManagement: "ਕੀਟ ਪ੍ਰਬੰਧਨ",

  explore: "ਖੋਜੋ",
  searchCrops: "ਫਸਲ ਜਾਂ ਬਿਮਾਰੀਆਂ ਖੋਜੋ...",
  popularCrops: "ਮਸ਼ਹੂਰ ਫਸਲਾਂ",
  allDiseases: "ਸਾਰੀਆਂ ਬਿਮਾਰੀਆਂ",

  profile: "ਪ੍ਰੋਫਾਈਲ",
  editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ",
  language: "ਭਾਸ਼ਾ",
  notifications: "ਸੂਚਨਾਵਾਂ",
  help: "ਮਦਦ",
  about: "ਬਾਰੇ",
  version: "ਵਰਜ਼ਨ",
  farmName: "ਖੇਤ ਦਾ ਨਾਮ",
  location: "ਸਥਾਨ",
};

// ─────────────────────────────────────────────────────────
const bn: Translations = {
  continue: "চালিয়ে যান",
  back: "পিছনে",
  save: "সংরক্ষণ করুন",
  cancel: "বাতিল করুন",
  loading: "লোড হচ্ছে...",
  error: "কিছু ভুল হয়েছে",
  retry: "আবার চেষ্টা করুন",
  success: "সফলতা",
  logout: "লগআউট",
  yes: "হ্যাঁ",
  no: "না",

  chooseLanguage: "আপনার ভাষা\nনির্বাচন করুন",
  chooseLanguageSub: "আপনার কৃষি অভিজ্ঞতা উন্নত করতে ভাষা নির্বাচন করুন।",

  onboarding1Title: "ফসলের রোগ শনাক্ত করুন",
  onboarding1Sub: "AI প্রযুক্তি ব্যবহার করে আপনার ফসলে রোগ তাৎক্ষণিকভাবে শনাক্ত করুন।",
  onboarding2Title: "বিশেষজ্ঞ পরামর্শ নিন",
  onboarding2Sub: "প্রতিটি রোগের জন্য চিকিৎসা ও প্রতিরোধের পরামর্শ পান।",
  onboarding3Title: "ভালো চাষ করুন, বেশি উপার্জন করুন",
  onboarding3Sub: "স্মার্ট তথ্য দিয়ে ফসল রক্ষা করুন ও উৎপাদন বাড়ান।",
  getStarted: "শুরু করুন",
  next: "পরবর্তী",
  skip: "এড়িয়ে যান",

  login: "লগইন",
  signup: "সাইন আপ",
  email: "ইমেইল",
  password: "পাসওয়ার্ড",
  confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
  forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
  fullName: "পূর্ণ নাম",
  phone: "ফোন নম্বর",
  loginSuccess: "সফলভাবে লগইন হয়েছে",
  signupSuccess: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
  invalidCredentials: "ভুল ইমেইল বা পাসওয়ার্ড",

  dashboard: "ড্যাশবোর্ড",
  welcomeBack: "ফিরে আসার জন্য স্বাগতম",
  quickScan: "দ্রুত স্ক্যান",
  recentScans: "সাম্প্রতিক স্ক্যান",
  viewAll: "সব দেখুন",
  healthyPlants: "সুস্থ গাছপালা",
  diseasesFound: "রোগ পাওয়া গেছে",
  totalScans: "মোট স্ক্যান",
  todayTip: "আজকের টিপস",

  scanTitle: "আপনার ফসল স্ক্যান করুন",
  scanSubtitle: "আক্রান্ত পাতা বা গাছের ছবি তুলুন বা আপলোড করুন",
  takePhoto: "ছবি তুলুন",
  uploadPhoto: "ছবি আপলোড করুন",
  analyzing: "আপনার ফসল বিশ্লেষণ করা হচ্ছে...",
  analyzeSuccess: "বিশ্লেষণ সম্পন্ন",
  noImageSelected: "অনুগ্রহ করে প্রথমে একটি ছবি নির্বাচন করুন",

  cropResult: "ফসলের ফলাফল",
  disease: "রোগ",
  confidence: "নির্ভরযোগ্যতা",
  treatment: "চিকিৎসা",
  prevention: "প্রতিরোধ",
  severity: "তীব্রতা",
  affectedArea: "আক্রান্ত এলাকা",
  recommendations: "সুপারিশ",
  saveResult: "ফলাফল সংরক্ষণ করুন",
  shareResult: "শেয়ার করুন",
  healthy: "সুস্থ",
  diseased: "রোগাক্রান্ত",

  history: "ইতিহাস",
  noHistory: "এখনও কোনো স্ক্যান নেই",
  noHistorySub: "আপনার স্ক্যান ইতিহাস এখানে দেখাবে",
  clearHistory: "ইতিহাস মুছুন",
  confirmClear: "আপনি কি সব ইতিহাস মুছতে চান?",

  tips: "টিপস",
  farmingTips: "কৃষি টিপস",
  seasonalTips: "মৌসুমী টিপস",
  pestManagement: "কীটপতঙ্গ ব্যবস্থাপনা",

  explore: "অন্বেষণ করুন",
  searchCrops: "ফসল বা রোগ খুঁজুন...",
  popularCrops: "জনপ্রিয় ফসল",
  allDiseases: "সব রোগ",

  profile: "প্রোফাইল",
  editProfile: "প্রোফাইল সম্পাদনা করুন",
  language: "ভাষা",
  notifications: "বিজ্ঞপ্তি",
  help: "সাহায্য",
  about: "সম্পর্কে",
  version: "সংস্করণ",
  farmName: "খামারের নাম",
  location: "অবস্থান",
};

// ─────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Translations> = {
  en,
  hi,
  mr,
  te,
  ta,
  kn,
  pa,
  bn,
};