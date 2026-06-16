import axios from 'axios';
import {
  getEmergencies,
  saveEmergencies,
  getHospitals,
  saveHospitals,
  getSchemes,
  saveSchemes,
  getEducations,
  getFeedbacks,
  saveFeedbacks
} from './mockData';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// Helper to check if it's a network/connectivity error
const isNetworkError = (error) => {
  return !error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error';
};

// Helper for user storage
const getMockUsers = () => {
  const data = localStorage.getItem('chh_mock_users');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // Fallback
    }
  }
  const defaultUsers = [
    {
      _id: 'user_admin_id_9999',
      name: 'Government Administrator',
      email: 'admin',
      role: 'admin',
      phone: '100',
      preferredLanguage: 'en',
      homeDistrict: 'visakhapatnam',
      isVerified: true
    }
  ];
  localStorage.setItem('chh_mock_users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveMockUsers = (users) => {
  localStorage.setItem('chh_mock_users', JSON.stringify(users));
};

// Helper to calculate distance for hospital search
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Endpoints definitions
export const auth = {
  login: async (credentials) => {
    try {
      return await API.post('/auth/login', credentials);
    } catch (err) {
      if (isNetworkError(err)) {
        const users = getMockUsers();
        const emailLower = credentials.email ? credentials.email.toLowerCase() : '';
        const user = users.find((u) => u.email.toLowerCase() === emailLower);
        if (
          user &&
          (credentials.password === 'AdminPassword123' ||
            credentials.password === 'adminpassword123' ||
            user.password === credentials.password)
        ) {
          const token = 'mock-jwt-token-xyz-12345';
          localStorage.setItem('token', token);
          return {
            status: 'success',
            token,
            data: { user }
          };
        }
        throw new Error('Incorrect email or password', { cause: err });
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      return await API.post('/auth/register', userData);
    } catch (err) {
      if (isNetworkError(err)) {
        const users = getMockUsers();
        const emailLower = userData.email ? userData.email.toLowerCase() : '';
        const existing = users.find((u) => u.email.toLowerCase() === emailLower);
        if (existing) {
          throw new Error('Email already in use', { cause: err });
        }
        const newUser = {
          _id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email.toLowerCase(),
          role: 'citizen',
          phone: userData.phone,
          preferredLanguage: userData.preferredLanguage || 'en',
          homeDistrict: userData.homeDistrict || '',
          isVerified: false,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveMockUsers(users);
        const token = `mock-jwt-token-${newUser._id}`;
        localStorage.setItem('token', token);
        return {
          status: 'success',
          token,
          data: { user: newUser }
        };
      }
      throw err;
    }
  },

  getMe: async () => {
    try {
      return await API.get('/auth/me');
    } catch (err) {
      if (isNetworkError(err)) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token provided', { cause: err });
        }
        const users = getMockUsers();
        let user;
        if (token === 'mock-jwt-token-xyz-12345') {
          user = users.find((u) => u.role === 'admin');
        } else {
          const userId = token.replace('mock-jwt-token-', '');
          user = users.find((u) => u._id === userId);
        }
        if (!user) {
          throw new Error('User not found', { cause: err });
        }
        return {
          status: 'success',
          data: { user }
        };
      }
      throw err;
    }
  }
};

export const emergency = {
  getAll: async (districtCode) => {
    try {
      return await API.get('/emergency', { params: { districtCode } });
    } catch (err) {
      if (isNetworkError(err)) {
        let services = getEmergencies().filter((s) => s.isActive);
        if (districtCode) {
          const lowerDistrict = districtCode.toLowerCase();
          services = services.filter(
            (s) => !s.districtCode || s.districtCode === lowerDistrict
          );
        }
        return {
          status: 'success',
          results: services.length,
          data: { services }
        };
      }
      throw err;
    }
  },

  create: async (data) => {
    try {
      return await API.post('/emergency', data);
    } catch (err) {
      if (isNetworkError(err)) {
        const services = getEmergencies();
        const newService = {
          _id: `emergency_${Date.now()}`,
          name: data.name,
          icon: data.icon || '📞',
          description: data.description,
          contactNumber: data.contactNumber,
          category: data.category,
          districtCode: data.districtCode ? data.districtCode.toLowerCase() : null,
          isActive: true
        };
        services.push(newService);
        saveEmergencies(services);
        return {
          status: 'success',
          data: { service: newService }
        };
      }
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      return await API.put(`/emergency/${id}`, data);
    } catch (err) {
      if (isNetworkError(err)) {
        const services = getEmergencies();
        const index = services.findIndex((e) => e._id === id);
        if (index === -1) {
          throw new Error('No emergency service found with that ID', { cause: err });
        }
        services[index] = { ...services[index], ...data };
        saveEmergencies(services);
        return {
          status: 'success',
          data: { service: services[index] }
        };
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      return await API.delete(`/emergency/${id}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const services = getEmergencies();
        const index = services.findIndex((e) => e._id === id);
        if (index === -1) {
          throw new Error('No emergency service found with that ID', { cause: err });
        }
        services.splice(index, 1);
        saveEmergencies(services);
        return {
          status: 'success',
          data: null
        };
      }
      throw err;
    }
  }
};

export const hospitals = {
  getAll: async (filters) => {
    try {
      return await API.get('/hospitals', { params: filters });
    } catch (err) {
      if (isNetworkError(err)) {
        const { districtCode, category, search } = filters || {};
        let results = [...getHospitals()];

        if (districtCode) {
          results = results.filter(
            (h) => h.districtCode === districtCode.toLowerCase()
          );
        }
        if (category) {
          results = results.filter((h) => h.category === category);
        }
        if (search) {
          const query = search.toLowerCase();
          results = results.filter(
            (h) =>
              (h.name.en && h.name.en.toLowerCase().includes(query)) ||
              (h.name.te && h.name.te.toLowerCase().includes(query)) ||
              (h.address.en && h.address.en.toLowerCase().includes(query))
          );
        }

        return {
          status: 'success',
          results: results.length,
          data: { hospitals: results }
        };
      }
      throw err;
    }
  },

  getNearby: async (lat, lng, radius) => {
    try {
      return await API.get('/hospitals/nearby', { params: { lat, lng, radius } });
    } catch (err) {
      if (isNetworkError(err)) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxRadius = parseFloat(radius || 10);

        const nearby = getHospitals().filter((h) => {
          const coords = h.location.coordinates;
          const distance = calculateDistance(latitude, longitude, coords[1], coords[0]);
          return distance <= maxRadius;
        });

        return {
          status: 'success',
          results: nearby.length,
          data: { hospitals: nearby }
        };
      }
      throw err;
    }
  },

  create: async (data) => {
    try {
      return await API.post('/hospitals', data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getHospitals();
        const newHospital = {
          _id: `hospital_${Date.now()}`,
          name: data.name,
          description: data.description,
          contactNumber: data.contactNumber,
          address: data.address,
          googleMapsUrl: data.googleMapsUrl,
          location: data.location || { type: 'Point', coordinates: [83.3, 17.7] },
          districtCode: data.districtCode.toLowerCase(),
          category: data.category || 'government',
          hasBloodBank: !!data.hasBloodBank,
          is24_7: !!data.is24_7
        };
        list.push(newHospital);
        saveHospitals(list);
        return {
          status: 'success',
          data: { hospital: newHospital }
        };
      }
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      return await API.put(`/hospitals/${id}`, data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getHospitals();
        const index = list.findIndex((h) => h._id === id);
        if (index === -1) {
          throw new Error('No hospital found with that ID', { cause: err });
        }
        if (data.districtCode) {
          data.districtCode = data.districtCode.toLowerCase();
        }
        list[index] = { ...list[index], ...data };
        saveHospitals(list);
        return {
          status: 'success',
          data: { hospital: list[index] }
        };
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      return await API.delete(`/hospitals/${id}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getHospitals();
        const index = list.findIndex((h) => h._id === id);
        if (index === -1) {
          throw new Error('No hospital found with that ID', { cause: err });
        }
        list.splice(index, 1);
        saveHospitals(list);
        return {
          status: 'success',
          data: null
        };
      }
      throw err;
    }
  }
};

export const schemes = {
  getAll: async (filters) => {
    try {
      return await API.get('/schemes', { params: filters });
    } catch (err) {
      if (isNetworkError(err)) {
        const { category, districtCode, search } = filters || {};
        let results = getSchemes().filter((s) => s.isActive);

        if (category && category !== 'all') {
          results = results.filter((s) => s.category === category);
        }
        if (districtCode) {
          const lowerDistrict = districtCode.toLowerCase();
          results = results.filter(
            (s) => !s.districtCode || s.districtCode === lowerDistrict
          );
        }
        if (search) {
          const query = search.toLowerCase();
          results = results.filter(
            (s) =>
              (s.title.en && s.title.en.toLowerCase().includes(query)) ||
              (s.title.te && s.title.te.toLowerCase().includes(query)) ||
              (s.benefits.en && s.benefits.en.toLowerCase().includes(query))
          );
        }

        return {
          status: 'success',
          results: results.length,
          data: { schemes: results }
        };
      }
      throw err;
    }
  },

  checkEligibility: async (profile) => {
    try {
      return await API.post('/schemes/check', profile);
    } catch (err) {
      if (isNetworkError(err)) {
        const { age, isStudent, isFarmer, gender } = profile;
        let categories = ['general'];

        if (isStudent) {
          categories.push('student');
        }
        if (isFarmer) {
          categories.push('farmer');
        }
        if (gender === 'female' || gender === 'women') {
          categories.push('women');
        }
        if (age && parseInt(age) >= 60) {
          categories.push('senior');
        }

        const matchingSchemes = getSchemes().filter(
          (s) => s.isActive && categories.includes(s.category)
        );

        return {
          status: 'success',
          results: matchingSchemes.length,
          data: { schemes: matchingSchemes }
        };
      }
      throw err;
    }
  },

  create: async (data) => {
    try {
      return await API.post('/schemes', data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getSchemes();
        const newScheme = {
          _id: `scheme_${Date.now()}`,
          title: data.title,
          category: data.category,
          eligibilityCriteria: data.eligibilityCriteria,
          benefits: data.benefits,
          officialWebsiteUrl: data.officialWebsiteUrl,
          districtCode: data.districtCode ? data.districtCode.toLowerCase() : null,
          isActive: true
        };
        list.push(newScheme);
        saveSchemes(list);
        return {
          status: 'success',
          data: { scheme: newScheme }
        };
      }
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      return await API.put(`/schemes/${id}`, data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getSchemes();
        const index = list.findIndex((s) => s._id === id);
        if (index === -1) {
          throw new Error('No scheme found with that ID', { cause: err });
        }
        if (data.districtCode) {
          data.districtCode = data.districtCode.toLowerCase();
        }
        list[index] = { ...list[index], ...data };
        saveSchemes(list);
        return {
          status: 'success',
          data: { scheme: list[index] }
        };
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      return await API.delete(`/schemes/${id}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getSchemes();
        const index = list.findIndex((s) => s._id === id);
        if (index === -1) {
          throw new Error('No scheme found with that ID', { cause: err });
        }
        list.splice(index, 1);
        saveSchemes(list);
        return {
          status: 'success',
          data: null
        };
      }
      throw err;
    }
  }
};

export const education = {
  getAll: async (category) => {
    try {
      return await API.get('/education', { params: { category } });
    } catch (err) {
      if (isNetworkError(err)) {
        let results = [...getEducations()];
        if (category) {
          results = results.filter((e) => e.category === category);
        }
        return {
          status: 'success',
          results: results.length,
          data: { resources: results }
        };
      }
      throw err;
    }
  },

  create: async (data) => {
    try {
      return await API.post('/education', data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getEducations();
        const newResource = {
          _id: `edu_${Date.now()}`,
          ...data
        };
        list.push(newResource);
        localStorage.setItem('chh_mock_educations', JSON.stringify(list));
        return {
          status: 'success',
          data: { resource: newResource }
        };
      }
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      return await API.put(`/education/${id}`, data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getEducations();
        const index = list.findIndex((e) => e._id === id);
        if (index === -1) {
          throw new Error('No educational resource found with that ID', { cause: err });
        }
        list[index] = { ...list[index], ...data };
        localStorage.setItem('chh_mock_educations', JSON.stringify(list));
        return {
          status: 'success',
          data: { resource: list[index] }
        };
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      return await API.delete(`/education/${id}`);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getEducations();
        const index = list.findIndex((e) => e._id === id);
        if (index === -1) {
          throw new Error('No educational resource found with that ID', { cause: err });
        }
        list.splice(index, 1);
        localStorage.setItem('chh_mock_educations', JSON.stringify(list));
        return {
          status: 'success',
          data: null
        };
      }
      throw err;
    }
  }
};

export const feedback = {
  submit: async (data) => {
    try {
      return await API.post('/feedback', data);
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getFeedbacks();
        const newFeedback = {
          _id: `feedback_${Date.now()}`,
          userId: null,
          name: data.name,
          email: data.email,
          message: data.message,
          category: data.category || 'suggestion',
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        list.push(newFeedback);
        saveFeedbacks(list);
        return {
          status: 'success',
          data: { feedback: newFeedback }
        };
      }
      throw err;
    }
  },

  getAll: async () => {
    try {
      return await API.get('/feedback');
    } catch (err) {
      if (isNetworkError(err)) {
        const list = getFeedbacks();
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        return {
          status: 'success',
          results: sorted.length,
          data: { feedbacks: sorted }
        };
      }
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    try {
      return await API.patch(`/feedback/${id}`, { status });
    } catch (err) {
      if (isNetworkError(err)) {
        if (!['pending', 'reviewed', 'resolved'].includes(status)) {
          throw new Error('Invalid feedback status value', { cause: err });
        }
        const list = getFeedbacks();
        const index = list.findIndex((f) => f._id === id);
        if (index === -1) {
          throw new Error('No feedback found with that ID', { cause: err });
        }
        list[index].status = status;
        saveFeedbacks(list);
        return {
          status: 'success',
          data: { feedback: list[index] }
        };
      }
      throw err;
    }
  }
};

export const chatbot = {
  ask: async (message, location, preferredLanguage) => {
    try {
      return await API.post('/chatbot', { message, location, preferredLanguage });
    } catch (err) {
      if (isNetworkError(err)) {
        const queryText = message.toLowerCase();
        const lang = preferredLanguage === 'te' ? 'te' : 'en';

        const schemesList = getSchemes().filter((s) => s.isActive);
        const matchedScheme = schemesList.find((s) => {
          const titleEn = (s.title.en || '').toLowerCase();
          const titleTe = (s.title.te || '').toLowerCase();

          return (
            queryText.includes(titleEn) ||
            queryText.includes(titleTe) ||
            (titleEn.includes('vydhyaseva') &&
              (queryText.includes('vydhya') ||
                queryText.includes('vydyaseva') ||
                queryText.includes('vidya') ||
                queryText.includes('vydya seva') ||
                queryText.includes('vydhyaseva'))) ||
            (titleEn.includes('sukhibava') &&
              (queryText.includes('sukhi') ||
                queryText.includes('farmer') ||
                queryText.includes('annadhatha') ||
                queryText.includes('annadata') ||
                queryText.includes('rythu'))) ||
            (titleEn.includes('vandanam') &&
              (queryText.includes('vandan') ||
                queryText.includes('thalliki') ||
                queryText.includes('talliki') ||
                queryText.includes('education') ||
                queryText.includes('school') ||
                queryText.includes('student'))) ||
            (titleEn.includes('bharosa') &&
              (queryText.includes('bharos') ||
                queryText.includes('pension') ||
                queryText.includes('senior') ||
                queryText.includes('citizen') ||
                queryText.includes('vruddha'))) ||
            (titleEn.includes('aada bidda') &&
              (queryText.includes('aada') ||
                queryText.includes('bidda') ||
                queryText.includes('women') ||
                queryText.includes('mahila') ||
                queryText.includes('1500')))
          );
        });

        if (matchedScheme) {
          const title = matchedScheme.title[lang] || matchedScheme.title.en;
          const eligibility =
            matchedScheme.eligibilityCriteria[lang] || matchedScheme.eligibilityCriteria.en;
          const benefits = matchedScheme.benefits[lang] || matchedScheme.benefits.en;
          const url = matchedScheme.officialWebsiteUrl;

          const reply =
            lang === 'en'
              ? `🌾 **${title} Details:**\n\n` +
                `- **Benefits:** ${benefits}\n` +
                `- **Eligibility:** ${eligibility}\n\n` +
                `ℹ️ **How to Apply:** You can apply directly through the official portal: [Official Website](${url}) or visit your local **Grama/Ward Sachivalayam** with your white ration card, Aadhaar, and relevant eligibility documents.`
              : `🌾 **${title} వివరాలు:**\n\n` +
                `- **ప్రయోజనాలు:** ${benefits}\n` +
                `- **అర్హత:** ${eligibility}\n\n` +
                `ℹ️ **దరఖాస్తు విధానం:** మీరు నేరుగా అధికారిక పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవచ్చు: [అధికారిక వెబ్‌సైట్](${url}) లేదా మీ గుర్తింపు మరియు అర్హత పత్రాలతో మీ స్థానిక **గ్రామ/వార్డు సచివాలయాన్ని** సందర్శించండి.`;

          return {
            status: 'success',
            data: { reply }
          };
        }

        if (
          queryText.includes('emergency') ||
          queryText.includes('help') ||
          queryText.includes('call') ||
          queryText.includes('number') ||
          queryText.includes('apada') ||
          queryText.includes('phone') ||
          queryText.includes('అత్యవసర') ||
          queryText.includes('సహాయం') ||
          queryText.includes('ఫోన్')
        ) {
          const services = getEmergencies()
            .filter((s) => s.isActive)
            .slice(0, 5);
          if (services.length > 0) {
            let reply =
              lang === 'en'
                ? '🚨 **Emergency Hotlines:**\nHere are the critical emergency services available:\n'
                : '🚨 **అత్యవసర హాట్‌లైన్‌లు:**\nఇక్కడ అందుబాటులో ఉన్న అత్యవసర సేవలు ఉన్నాయి:\n';

            services.forEach((s) => {
              const name = s.name[lang] || s.name.en;
              reply += `- **${name}**: 📞 ${s.contactNumber}\n`;
            });
            return {
              status: 'success',
              data: { reply }
            };
          }
        }

        if (
          queryText.includes('hospital') ||
          queryText.includes('doctor') ||
          queryText.includes('medical') ||
          queryText.includes('vaidya') ||
          queryText.includes('rakta') ||
          queryText.includes('blood') ||
          queryText.includes('kgh') ||
          queryText.includes('ఆసుపత్రి') ||
          queryText.includes('వైద్య') ||
          queryText.includes('vydhya')
        ) {
          let results = [...getHospitals()];
          if (location) {
            results = results.filter((h) => h.districtCode === location.toLowerCase());
          }
          const hospitalsList = results.slice(0, 3);

          if (hospitalsList.length > 0) {
            let reply =
              lang === 'en'
                ? `🏥 **Healthcare Facilities in ${location || 'Andhra Pradesh'}:**\n`
                : `🏥 **${location || 'ఆంధ్రప్రదేశ్'} లోని ఆరోగ్య సంరక్షణ కేంద్రాలు:**\n`;

            hospitalsList.forEach((h) => {
              const name = h.name[lang] || h.name.en;
              const addr = h.address[lang] || h.address.en;
              reply += `- **${name}**: ${addr} (Phone: ${h.contactNumber})\n`;
            });
            return {
              status: 'success',
              data: { reply }
            };
          } else {
            const reply =
              lang === 'en'
                ? '🏥 No specific hospitals found in your location. Try searching for other districts like Anakapalle or Visakhapatnam.'
                : '🏥 మీ ప్రాంతంలో ఆసుపత్రులు కనుగొనబడలేదు. అనకాపల్లి లేదా విశాఖపట్నం వంటి జిల్లాల కోసం వెతకండి.';
            return {
              status: 'success',
              data: { reply }
            };
          }
        }

        if (
          queryText.includes('scheme') ||
          queryText.includes('schema') ||
          queryText.includes('schemes') ||
          queryText.includes('pension') ||
          queryText.includes('money') ||
          queryText.includes('welfare') ||
          queryText.includes('bharosa') ||
          queryText.includes('sukhibava') ||
          queryText.includes('nidhi') ||
          queryText.includes('pathakam') ||
          queryText.includes('pathakalu') ||
          queryText.includes('పెన్షన్') ||
          queryText.includes('పథకం')
        ) {
          const list = getSchemes()
            .filter((s) => s.isActive)
            .slice(0, 5);
          if (list.length > 0) {
            let reply =
              lang === 'en'
                ? '🌾 **Government Welfare Schemes:**\nHere is a list of available schemes. You can ask me details about any specific scheme (e.g. "How to apply for NTR Vydhyaseva"):\n'
                : '🌾 **ప్రభుత్వ సంక్షేమ పథకాలు:**\nఇక్కడ అందుబాటులో ఉన్న పథకాలు ఉన్నాయి. మీరు ఏదైనా నిర్దిష్ట పథకం గురించిన వివరాలను నన్ను అడగవచ్చు (ఉదా. "NTR Vydhyaseva కి ఎలా దరఖాస్తు చేయాలి"):\n';

            list.forEach((s) => {
              const title = s.title[lang] || s.title.en;
              const benefits = s.benefits[lang] || s.benefits.en;
              reply += `- **${title}**: ${benefits}\n`;
            });
            return {
              status: 'success',
              data: { reply }
            };
          }
        }

        const reply =
          lang === 'en'
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

        return {
          status: 'success',
          data: { reply }
        };
      }
      throw err;
    }
  }
};

export default API;

