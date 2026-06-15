const Hospital = require('../models/hospital.model');
const Scheme = require('../models/scheme.model');
const Emergency = require('../models/emergency.model');
const mockDb = require('../utils/mockDb');
const logger = require('../utils/logger');

exports.processChatQuery = async (message, location, preferredLanguage = 'en') => {
  const queryText = message.toLowerCase();
  const lang = preferredLanguage === 'te' ? 'te' : 'en';

  // 1. Specific Entity Match: Check for specific Scheme matching keywords first
  let schemesList;
  if (global.dbOffline) {
    schemesList = mockDb.schemes.filter(s => s.isActive);
  } else {
    schemesList = await Scheme.find({ isActive: true });
  }

  const matchedScheme = schemesList.find(s => {
    const titleEn = (s.title.en || '').toLowerCase();
    const titleTe = (s.title.te || '').toLowerCase();
    
    return queryText.includes(titleEn) || 
           queryText.includes(titleTe) ||
           (titleEn.includes('vydhyaseva') && (queryText.includes('vydhya') || queryText.includes('vydyaseva') || queryText.includes('vidya') || queryText.includes('vydya seva') || queryText.includes('vydhyaseva'))) ||
           (titleEn.includes('sukhibava') && (queryText.includes('sukhi') || queryText.includes('farmer') || queryText.includes('annadhatha') || queryText.includes('annadata') || queryText.includes('rythu'))) ||
           (titleEn.includes('vandanam') && (queryText.includes('vandan') || queryText.includes('thalliki') || queryText.includes('talliki') || queryText.includes('education') || queryText.includes('school') || queryText.includes('student'))) ||
           (titleEn.includes('bharosa') && (queryText.includes('bharos') || queryText.includes('pension') || queryText.includes('senior') || queryText.includes('citizen') || queryText.includes('vruddha'))) ||
           (titleEn.includes('aada bidda') && (queryText.includes('aada') || queryText.includes('bidda') || queryText.includes('women') || queryText.includes('mahila') || queryText.includes('1500')));
  });

  if (matchedScheme) {
    const title = matchedScheme.title[lang] || matchedScheme.title.en;
    const eligibility = matchedScheme.eligibilityCriteria[lang] || matchedScheme.eligibilityCriteria.en;
    const benefits = matchedScheme.benefits[lang] || matchedScheme.benefits.en;
    const url = matchedScheme.officialWebsiteUrl;

    let response = lang === 'en'
      ? `🌾 **${title} Details:**\n\n` +
        `- **Benefits:** ${benefits}\n` +
        `- **Eligibility:** ${eligibility}\n\n` +
        `ℹ️ **How to Apply:** You can apply directly through the official portal: [Official Website](${url}) or visit your local **Grama/Ward Sachivalayam** with your white ration card, Aadhaar, and relevant eligibility documents.`
      : `🌾 **${title} వివరాలు:**\n\n` +
        `- **ప్రయోజనాలు:** ${benefits}\n` +
        `- **అర్హత:** ${eligibility}\n\n` +
        `ℹ️ **దరఖాస్తు విధానం:** మీరు నేరుగా అధికారిక పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవచ్చు: [అధికారిక వెబ్‌సైట్](${url}) లేదా మీ గుర్తింపు మరియు అర్హత పత్రాలతో మీ స్థానిక **గ్రామ/వార్డు సచివాలయాన్ని** సందర్శించండి.`;
    
    return response;
  }

  // 2. Generic Local matched intents (Emergency, Hospitals, Schemes)
  
  // Emergency intent
  if (queryText.includes('emergency') || queryText.includes('help') || queryText.includes('call') || queryText.includes('number') || queryText.includes('apada') || queryText.includes('phone') || queryText.includes('అత్యవసర') || queryText.includes('సహాయం') || queryText.includes('ఫోన్')) {
    let services;
    if (global.dbOffline) {
      services = mockDb.emergencies.filter(s => s.isActive).slice(0, 5);
    } else {
      services = await Emergency.find({ isActive: true }).limit(5);
    }

    if (services.length > 0) {
      let response = lang === 'en' 
        ? "🚨 **Emergency Hotlines:**\nHere are the critical emergency services available:\n"
        : "🚨 **అత్యవసర హాట్‌లైన్‌లు:**\nఇక్కడ అందుబాటులో ఉన్న అత్యవసర సేవలు ఉన్నాయి:\n";
      
      services.forEach(s => {
        const name = s.name[lang] || s.name.en;
        response += `- **${name}**: 📞 ${s.contactNumber}\n`;
      });
      return response;
    }
  }

  // Hospital intent
  if (queryText.includes('hospital') || queryText.includes('doctor') || queryText.includes('medical') || queryText.includes('vaidya') || queryText.includes('rakta') || queryText.includes('blood') || queryText.includes('kgh') || queryText.includes('ఆసుపత్రి') || queryText.includes('వైద్య') || queryText.includes('vydhya')) {
    let hospitals;
    
    if (global.dbOffline) {
      let results = [...mockDb.hospitals];
      if (location) {
        results = results.filter(h => h.districtCode === location.toLowerCase());
      }
      hospitals = results.slice(0, 3);
    } else {
      let query = {};
      if (location) {
        query.districtCode = location.toLowerCase();
      }
      hospitals = await Hospital.find(query).limit(3);
    }

    if (hospitals.length > 0) {
      let response = lang === 'en'
        ? `🏥 **Healthcare Facilities in ${location || 'Andhra Pradesh'}:**\n`
        : `🏥 **${location || 'ఆంధ్రప్రదేశ్'} లోని ఆరోగ్య సంరక్షణ కేంద్రాలు:**\n`;
      
      hospitals.forEach(h => {
        const name = h.name[lang] || h.name.en;
        const addr = h.address[lang] || h.address.en;
        response += `- **${name}**: ${addr} (Phone: ${h.contactNumber})\n`;
      });
      return response;
    } else {
      return lang === 'en'
        ? "🏥 No specific hospitals found in your location. Try searching for other districts like Anakapalle or Visakhapatnam."
        : "🏥 మీ ప్రాంతంలో ఆసుపత్రులు కనుగొనబడలేదు. అనకాపల్లి లేదా విశాఖపట్నం వంటి జిల్లాల కోసం వెతకండి.";
    }
  }

  // General Scheme list intent (matches "scheme", "schema", "pathakam", etc.)
  if (queryText.includes('scheme') || queryText.includes('schema') || queryText.includes('schemes') || queryText.includes('pension') || queryText.includes('money') || queryText.includes('welfare') || queryText.includes('bharosa') || queryText.includes('sukhibava') || queryText.includes('nidhi') || queryText.includes('pathakam') || queryText.includes('pathakalu') || queryText.includes('పెన్షన్') || queryText.includes('పథకం')) {
    let schemes;
    if (global.dbOffline) {
      schemes = mockDb.schemes.filter(s => s.isActive).slice(0, 5);
    } else {
      schemes = await Scheme.find({ isActive: true }).limit(5);
    }

    if (schemes.length > 0) {
      let response = lang === 'en'
        ? "🌾 **Government Welfare Schemes:**\nHere is a list of available schemes. You can ask me details about any specific scheme (e.g. \"How to apply for NTR Vydhyaseva\"):\n"
        : "🌾 **ప్రభుత్వ సంక్షేమ పథకాలు:**\nఇక్కడ అందుబాటులో ఉన్న పథకాలు ఉన్నాయి. మీరు ఏదైనా నిర్దిష్ట పథకం గురించిన వివరాలను నన్ను అడగవచ్చు (ఉదా. \"NTR Vydhyaseva కి ఎలా దరఖాస్తు చేయాలి\"):\n";
      
      schemes.forEach(s => {
        const title = s.title[lang] || s.title.en;
        const benefits = s.benefits[lang] || s.benefits.en;
        response += `- **${title}**: ${benefits}\n`;
      });
      return response;
    }
  }

  // 3. Call external Gemini API if key is present (using modern gemini-1.5-flash)
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are the Assistant for the Community Help Hub platform. Help the user answer their query about citizen welfare, emergency hotlines, and public services in Andhra Pradesh, India.
              User query: "${message}"
              Preferred language: ${lang}
              Current user district location: ${location || 'Unknown'}`
            }]
          }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      logger.error(`Gemini API Error: ${err.message}`);
    }
  }

  // 4. Default Fallback response
  return lang === 'en'
    ? `Hello! I am your Community Help Hub assistant. You can ask me about:
    - 🚑 **Emergency phone numbers** (Ambulance, Fire, Police)
    - 🏥 **Hospitals and clinics** by district
    - 🌾 **Government welfare schemes** (Thalliki vandanam, NTR Bharosa, etc.)
    How can I help you today?`
    : `నమస్కారం! నేను మీ కమ్యూనిటీ హెల్ప్ హబ్ సహాయకుడిని. మీరు నన్ను వీటి గురించి అడగవచ్చు:
    - 🚑 **అత్యవసర ఫోన్ నంబర్లు** (అంబులెన్స్, ఫైర్, పోలీస్)
    - 🏥 **ఆసుపత్రులు మరియు క్లినిక్‌లు** జిల్లాల వారీగా
    - 🌾 **ప్రభుత్వ సంక్షేమ పథకాలు** (తల్లికి వందనం, ఎన్టీఆర్ భరోసా, మొదలైనవి)
    ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?`;
};

