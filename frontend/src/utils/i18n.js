import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Community Help Hub",
      subtitle: "Your One-Stop Platform for Public Services & Emergency Assistance",
      home: "Home",
      emergency: "Emergency",
      healthcare: "Healthcare",
      schemes: "Schemes",
      education: "Education",
      contact: "Contact",
      login: "Login",
      admin: "Admin Portal",
      logout: "Logout",
      exploreServices: "Explore Services",
      searchPlaceholder: "Search services, hospitals, welfare schemes...",
      districtSelect: "Select District",
      aboutTitle: "About Our Project",
      aboutDesc: "Community Help Hub is a citizen-centric platform designed to provide instant access to emergency services, healthcare facilities, government welfare schemes, educational resources, and public support services across Andhra Pradesh.",
      callNow: "Call Now",
      viewLocation: "View Location",
      allCategories: "All Categories",
      students: "Students",
      farmers: "Farmers",
      women: "Women",
      seniors: "Senior Citizens",
      eligibilityWizard: "Eligibility Checker",
      feedbackTitle: "Contact & Feedback",
      feedbackPlaceholder: "Enter Your Feedback / Complaint",
      submit: "Submit Feedback",
      nearbyServices: "Find Nearby Services",
      bloodBank: "Find Blood Banks",
      primaryHealth: "Find Primary Health Centres"
    }
  },
  te: {
    translation: {
      title: "కమ్యూనిటీ హెల్ప్ హబ్",
      subtitle: "ప్రజా సేవలు & అత్యవసర సహాయం కోసం మీ వన్-స్టాప్ వేదిక",
      home: "హోమ్",
      emergency: "అత్యవసర సేవలు",
      healthcare: "ఆరోగ్య సంరక్షణ",
      schemes: "పథకాలు",
      education: "విద్య & కెరీర్",
      contact: "సంప్రదించండి",
      login: "లాగిన్",
      admin: "అడ్మిన్ పోర్టల్",
      logout: "లాగ్ అవుట్",
      exploreServices: "సేవలను అన్వేషించండి",
      searchPlaceholder: "సేవలు, ఆసుపత్రులు, సంక్షేమ పథకాలను వెతకండి...",
      districtSelect: "జిల్లాను ఎంచుకోండి",
      aboutTitle: "మా ప్రాజెక్ట్ గురించి",
      aboutDesc: "కమ్యూనిటీ హెల్ప్ హబ్ అనేది ఆంధ్రప్రదేశ్ వ్యాప్తంగా అత్యవసర సేవలు, ఆరోగ్య కేంద్రాలు, ప్రభుత్వ సంక్షేమ పథకాలు, విద్యా వనరులు మరియు ప్రజా మద్దతు సేవలను తక్షణమే పొందడానికి రూపొందించబడిన ఒక పౌర-కేంద్రీకృత వేదిక.",
      callNow: "కాల్ చేయండి",
      viewLocation: "చిరునామా చూడండి",
      allCategories: "అన్ని విభాగాలు",
      students: "విద్యార్థులు",
      farmers: "రైతులు",
      women: "మహిళలు",
      seniors: "వృద్ధులు",
      eligibilityWizard: "పథకాల అర్హత తనిఖీ",
      feedbackTitle: "సంప్రదింపులు & అభిప్రాయం",
      feedbackPlaceholder: "మీ అభిప్రాయం లేదా ఫిర్యాదును నమోదు చేయండి",
      submit: "అభిప్రాయాన్ని సమర్పించండి",
      nearbyServices: "సమీప సేవలను కనుగొనండి",
      bloodBank: "బ్లడ్ బ్యాంక్ ని కనుగొనండి",
      primaryHealth: "PHC ని కనుగొనండి"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
