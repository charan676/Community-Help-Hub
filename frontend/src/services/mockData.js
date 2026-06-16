const initialEmergencies = [
  {
    _id: 'emergency_1',
    name: { en: 'Ambulance Service', te: 'అంబులెన్స్ సేవ' },
    icon: '🚑',
    description: { en: '24/7 Emergency Medical Assistance across Andhra Pradesh.', te: 'ఆంధ్రప్రదేశ్ వ్యాప్తంగా 24/7 అత్యవసర వైద్య సహాయం.' },
    contactNumber: '108',
    category: 'medical',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'emergency_2',
    name: { en: 'Police Emergency', te: 'పోలీస్ అత్యవసర' },
    icon: '👮',
    description: { en: 'Emergency police assistance and public safety support.', te: 'అత్యవసర పోలీసు సహాయం మరియు ప్రజా రక్షణ మద్దతు.' },
    contactNumber: '112',
    category: 'police',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'emergency_3',
    name: { en: 'Fire & Rescue', te: 'అగ్నిమాపక & రక్షణ' },
    icon: '🔥',
    description: { en: 'Fire emergencies, rescue operations and disaster response.', te: 'అగ్ని ప్రమాదాలు, రక్షణ చర్యలు మరియు విపత్తు ప్రతిస్పందన.' },
    contactNumber: '101',
    category: 'fire',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'emergency_4',
    name: { en: 'Women Helpline', te: 'మహిళా హెల్ప్‌లైన్' },
    icon: '👩',
    description: { en: 'Support and protection services for women.', te: 'మహిళలకు మద్దతు మరియు రక్షణ సేవలు.' },
    contactNumber: '181',
    category: 'women',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'emergency_5',
    name: { en: 'Child Helpline', te: 'చైల్డ్ హెల్ప్‌లైన్' },
    icon: '👶',
    description: { en: 'Emergency support and protection for children.', te: 'పిల్లల కోసం అత్యవసర మద్దతు మరియు రక్షణ.' },
    contactNumber: '1098',
    category: 'child',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'emergency_6',
    name: { en: 'Disaster Management', te: 'విపత్తు నిర్వహణ' },
    icon: '🌊',
    description: { en: 'Floods, cyclones, earthquakes and natural disaster assistance.', te: 'వరదలు, తుఫానులు, భూకంపాలు మరియు సహజ విపత్తు సహాయం.' },
    contactNumber: '1070',
    category: 'disaster',
    districtCode: null,
    isActive: true
  }
];

const initialHospitals = [
  {
    _id: 'hospital_1',
    name: { en: 'Area Hospital, Anakapalle', te: 'ఏరియా ఆసుపత్రి, అనకాపల్లి' },
    description: { en: 'Government hospital providing healthcare services to local residents.', te: 'స్థానిక నివాసితులకు ఆరోగ్య సేవలను అందించే ప్రభుత్వ ఆసుపత్రి.' },
    contactNumber: '08924-222033',
    address: { en: 'Anakapalle Town, Visakhapatnam District, Andhra Pradesh', te: 'అనకాపల్లి టౌన్, విశాఖపట్నం జిల్లా, ఆంధ్రప్రదేశ్' },
    googleMapsUrl: 'https://maps.google.com/?q=Area+Hospital+Anakapalle',
    location: {
      type: 'Point',
      coordinates: [83.0039, 17.6896]
    },
    districtCode: 'anakapalle',
    category: 'government',
    hasBloodBank: true,
    is24_7: true
  },
  {
    _id: 'hospital_2',
    name: { en: 'King George Hospital (KGH)', te: 'కింగ్ జార్జ్ ఆసుపత్రి (KGH)' },
    description: { en: 'One of the largest government teaching hospitals in Andhra Pradesh.', te: 'ఆంధ్రప్రదేశ్ లోని అతిపెద్ద ప్రభుత్వ బోధనా ఆసుపత్రులలో ఒకటి.' },
    contactNumber: '0891-2564891',
    address: { en: 'Maharanipeta, Visakhapatnam, Andhra Pradesh', te: 'మహారాణిపేట, విశాఖపట్నం, ఆంధ్రప్రదేశ్' },
    googleMapsUrl: 'https://maps.google.com/?q=King+George+Hospital+Visakhapatnam',
    location: {
      type: 'Point',
      coordinates: [83.3032, 17.7034]
    },
    districtCode: 'visakhapatnam',
    category: 'government',
    hasBloodBank: true,
    is24_7: true
  },
  {
    _id: 'hospital_3',
    name: { en: 'District Area Hospital, Paderu', te: 'జిల్లా ఏరియా ఆసుపత్రి, పాడేరు' },
    description: { en: 'Government district hospital providing healthcare services to tribal and local residents.', te: 'గిరిజన మరియు స్థానిక నివాసితులకు ఆరోగ్య సేవలను అందించే ప్రభుత్వ జిల్లా ఆసుపత్రి.' },
    contactNumber: '08935-250222',
    address: { en: 'Paderu Town, Alluri Sitharama Raju District, Andhra Pradesh', te: 'పాడేరు టౌన్, అల్లూరి సీతారామరాజు జిల్లా, ఆంధ్రప్రదేశ్' },
    googleMapsUrl: 'https://maps.google.com/?q=Area+Hospital+Paderu',
    location: {
      type: 'Point',
      coordinates: [82.6625, 18.0833]
    },
    districtCode: 'alluri',
    category: 'government',
    hasBloodBank: true,
    is24_7: true
  }
];

const initialSchemes = [
  {
    _id: 'scheme_1',
    title: { en: 'Thalliki vandanam', te: 'తల్లికి వందనం' },
    category: 'student',
    eligibilityCriteria: {
      en: 'Students pursuing higher education in recognized schools/colleges.',
      te: 'గుర్తింపు పొందిన పాఠశాలలు/కళాశాలల్లో ఉన్నత విద్యను అభ్యసిస్తున్న విద్యార్థులు.'
    },
    benefits: {
      en: 'Reimbursement of tuition fees and financial incentives for education.',
      te: 'ట్యూషన్ ఫీజుల రీయింబర్స్మెంట్ మరియు విద్య కోసం ఆర్థిక ప్రోత్సాహకాలు.'
    },
    officialWebsiteUrl: 'https://share.google/bAhd1rywQmDPwpPKF',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'scheme_2',
    title: { en: 'NTR Vydhyaseva', te: 'ఎన్టీఆర్ వైద్యసేవ' },
    category: 'general',
    eligibilityCriteria: {
      en: 'Eligible low-income families in Andhra Pradesh holding white ration cards.',
      te: 'వైట్ రేషన్ కార్డులు ఉన్న ఆంధ్రప్రదేశ్ లోని అర్హత గల తక్కువ ఆదాయ కుటుంబాలు.'
    },
    benefits: {
      en: 'Cashless medical treatment in registered network hospitals up to ₹5 Lakhs.',
      te: 'నమోదిత నెట్‌వర్క్ ఆసుపత్రులలో ₹5 లక్షల వరకు నగదు రహిత వైద్య చికిత్స.'
    },
    officialWebsiteUrl: 'https://share.google/izbVwYwViaAOrV4ut',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'scheme_3',
    title: { en: 'Annadhatha Sukhibava', te: 'అన్నదాత సుఖీభవ' },
    category: 'farmer',
    eligibilityCriteria: {
      en: 'Farmers and cultivators holding land ownership records in Andhra Pradesh.',
      te: 'ఆంధ్రప్రదేశ్ లో భూమి యాజమాన్య రికార్డులను కలిగి ఉన్న రైతులు మరియు సాగుదారులు.'
    },
    benefits: {
      en: 'Financial support for buying farming inputs, seeds, and fertilizers.',
      te: 'వ్యవసాయ పెట్టుబడులు, విత్తనాలు మరియు ఎరువులు కొనుగోలు చేయడానికి ఆర్థిక సహాయం.'
    },
    officialWebsiteUrl: 'https://share.google/rTWlJ37WuULBs4wU8',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'scheme_4',
    title: { en: 'Aada Bidda Nidhi Scheme', te: 'ఆడబిడ్డ నిధి పథకం' },
    category: 'women',
    eligibilityCriteria: {
      en: 'Women beneficiaries aged 18 to 59 years belonging to low-income brackets.',
      te: 'తక్కువ ఆదాయ వర్గాలకు చెందిన 18 నుండి 59 సంవత్సరాల వయస్సు గల మహిళా లబ్ధిదారులు.'
    },
    benefits: {
      en: 'Monthly financial assistance of ₹1500 for livelihood support.',
      te: 'జీవనోపాధి మద్దతు కోసం నెలకు ₹1500 ఆర్థిక సహాయం.'
    },
    officialWebsiteUrl: 'https://share.google/72IpoIqUSR2z8qgOd',
    districtCode: null,
    isActive: true
  },
  {
    _id: 'scheme_5',
    title: { en: 'NTR Bharosa Pension', te: 'ఎన్టీఆర్ భరోసా పెన్షన్' },
    category: 'senior',
    eligibilityCriteria: {
      en: 'Senior citizens aged 60+ years, widows, weavers, and disabled beneficiaries.',
      te: '60+ సంవత్సరాల వయస్సు గల సీనియర్ సిటిజన్లు, వితంతువులు, చేనేత కార్మికులు మరియు వికలాంగులు.'
    },
    benefits: {
      en: 'Monthly pension support ranging from ₹4000 to ₹6000 directly to bank accounts.',
      te: 'నెలవారీ పెన్షన్ ₹4000 నుండి ₹6000 వరకు నేరుగా బ్యాంకు ఖాతాల్లో జమ చేయబడుతుంది.'
    },
    officialWebsiteUrl: 'https://sspensions.ap.gov.in/',
    districtCode: null,
    isActive: true
  }
];

const initialEducations = [
  {
    _id: 'edu_1',
    title: { en: 'AP Skill Development (APSSDC)', te: 'ఏపీ నైపుణ్యాభివృద్ధి సంస్థ (APSSDC)' },
    description: { en: 'Skill training, certifications, job fairs and placement opportunities for Andhra Pradesh youth.', te: 'ఆంధ్రప్రదేశ్ యువతకు నైపుణ్య శిక్షణ, ధృవీకరణ పత్రాలు, ఉద్యోగ మేళాలు మరియు ప్లేస్‌మెంట్ అవకాశాలు.' },
    providerName: 'APSSDC',
    category: 'skills',
    linkUrl: 'http://www.apssdc.in',
    isFree: true
  },
  {
    _id: 'edu_2',
    title: { en: 'National Scholarship Portal', te: 'జాతీయ స్కాలర్‌షిప్ పోర్టల్' },
    description: { en: 'Apply for Central and State Government scholarships online.', te: 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ స్కాలర్‌షిప్‌ల కోసం ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి.' },
    providerName: 'Ministry of Electronics & IT',
    category: 'scholarship',
    linkUrl: 'https://scholarships.gov.in',
    isFree: true
  },
  {
    _id: 'edu_3',
    title: { en: 'SWAYAM', te: 'స్వయం (SWAYAM)' },
    description: { en: 'Free online courses from IITs, NITs and leading universities.', te: 'ఐఐటీలు, ఎన్‌ఐటీలు మరియు ప్రముఖ విశ్వవిద్యాలయాల నుండి ఉచిత ఆన్‌లైన్ కోర్సులు.' },
    providerName: 'AICTE / MHRD',
    category: 'courses',
    linkUrl: 'https://swayam.gov.in',
    isFree: true
  },
  {
    _id: 'edu_4',
    title: { en: 'NPTEL', te: 'ఎన్‌పీటీఈఎల్ (NPTEL)' },
    description: { en: 'Technical and professional certification courses from IITs.', te: 'ఐఐటీల నుండి సాంకేతిక మరియు వృత్తిపరమైన ధృవీకరణ కోర్సులు.' },
    providerName: 'IITs & IISc',
    category: 'courses',
    linkUrl: 'https://nptel.ac.in',
    isFree: true
  },
  {
    _id: 'edu_5',
    title: { en: 'Employment News', te: 'ఉద్యోగ సమాచారం' },
    description: { en: 'Government jobs, recruitment notifications and career opportunities.', te: 'ప్రభుత్వ ఉద్యోగాలు, నియామక నోటిఫికేషన్లు మరియు కెరీర్ అవకాశాలు.' },
    providerName: 'Ministry of Information & Broadcasting',
    category: 'career_opportunities',
    linkUrl: 'https://share.google/atqHsh9QS03hEMYsf',
    isFree: false
  },
  {
    _id: 'edu_6',
    title: { en: 'AP Government Jobs (APPSC)', te: 'ఏపీ ప్రభుత్వ ఉద్యోగాలు' },
    description: { en: 'Latest Andhra Pradesh government recruitment notifications.', te: 'తాజా ఆంధ్రప్రదేశ్ ప్రభుత్వ నియామక నోటిఫికేషన్లు.' },
    providerName: 'APPSC',
    category: 'career_opportunities',
    linkUrl: 'https://psc.ap.gov.in',
    isFree: false
  }
];

// Load from localStorage or set defaults
const getStored = (key, initial) => {
  const data = localStorage.getItem(`chh_mock_${key}`);
  if (data) {
    try { return JSON.parse(data); } catch { return initial; }
  }
  localStorage.setItem(`chh_mock_${key}`, JSON.stringify(initial));
  return initial;
};

const setStored = (key, val) => {
  localStorage.setItem(`chh_mock_${key}`, JSON.stringify(val));
};

export const getEmergencies = () => getStored('emergencies', initialEmergencies);
export const saveEmergencies = (list) => setStored('emergencies', list);

export const getHospitals = () => getStored('hospitals', initialHospitals);
export const saveHospitals = (list) => setStored('hospitals', list);

export const getSchemes = () => getStored('schemes', initialSchemes);
export const saveSchemes = (list) => setStored('schemes', list);

export const getEducations = () => getStored('educations', initialEducations);

export const getFeedbacks = () => getStored('feedbacks', []);
export const saveFeedbacks = (list) => setStored('feedbacks', list);
