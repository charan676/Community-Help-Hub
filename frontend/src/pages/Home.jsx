import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import Spinner from '../components/common/Spinner';
import { emergency, hospitals, schemes } from '../services/api';

const DISTRICTS = [
  { code: 'anakapalle', name: 'Anakapalle' },
  { code: 'visakhapatnam', name: 'Visakhapatnam' },
  { code: 'alluri', name: 'Alluri Sitharama Raju' },
  { code: 'anantapur', name: 'Anantapur' },
  { code: 'annamayya', name: 'Annamayya' },
  { code: 'bapatla', name: 'Bapatla' },
  { code: 'chittoor', name: 'Chittoor' },
  { code: 'eastgodavari', name: 'East Godavari' },
  { code: 'eluru', name: 'Eluru' },
  { code: 'guntur', name: 'Guntur' },
  { code: 'kakinada', name: 'Kakinada' },
  { code: 'konaseema', name: 'Dr. B.R. Ambedkar Konaseema' },
  { code: 'krishna', name: 'Krishna' },
  { code: 'kurnool', name: 'Kurnool' },
  { code: 'nandyal', name: 'Nandyal' },
  { code: 'ntr', name: 'NTR District' },
  { code: 'palnadu', name: 'Palnadu' },
  { code: 'parvathipuram', name: 'Parvathipuram Manyam' },
  { code: 'prakasam', name: 'Prakasam' },
  { code: 'srikakulam', name: 'Srikakulam' },
  { code: 'spsrnellore', name: 'SPSR Nellore' },
  { code: 'tirupati', name: 'Tirupati' },
  { code: 'vizianagaram', name: 'Vizianagaram' },
  { code: 'westgodavari', name: 'West Godavari' },
  { code: 'ysrkadapa', name: 'YSR Kadapa' }
];

export const Home = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(localStorage.getItem('selectedDistrict') || '');
  const [loading, setLoading] = useState(false);

  // Search result lists
  const [emergencyList, setEmergencyList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [schemeList, setSchemeList] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [emergRes, hospRes, schemeRes] = await Promise.all([
        emergency.getAll(selectedDistrict),
        hospitals.getAll({ districtCode: selectedDistrict }),
        schemes.getAll() // Retrieve all schemes globally without district filtering
      ]);

      setEmergencyList(emergRes.data.services);
      setHospitalList(hospRes.data.hospitals);
      setSchemeList(schemeRes.data.schemes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    localStorage.setItem('selectedDistrict', selectedDistrict);
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData, selectedDistrict]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter elements locally based on user text query
  const filteredEmergencies = emergencyList.filter((item) => {
    const title = (item.name[lang] || item.name.en).toLowerCase();
    const desc = (item.description[lang] || item.description.en || '').toLowerCase();
    return title.includes(searchQuery) || desc.includes(searchQuery) || item.contactNumber.includes(searchQuery);
  });

  const filteredHospitals = hospitalList.filter((item) => {
    const name = (item.name[lang] || item.name.en).toLowerCase();
    const desc = (item.description?.[lang] || item.description?.en || '').toLowerCase();
    const addr = (item.address[lang] || item.address.en).toLowerCase();
    return name.includes(searchQuery) || desc.includes(searchQuery) || addr.includes(searchQuery);
  });

  const filteredSchemes = schemeList.filter((item) => {
    const title = (item.title[lang] || item.title.en).toLowerCase();
    const benefits = (item.benefits[lang] || item.benefits.en).toLowerCase();
    const category = (item.category || '').toLowerCase();
    
    // If searching generally for "scheme", show all schemes regardless of specific titles
    if (searchQuery === 'scheme' || searchQuery === 'schemes' || searchQuery === 'schema') {
      return true;
    }
    
    // Avoid false positive matches for general terms like "hospital" in benefits description text
    if (searchQuery === 'hospital' || searchQuery === 'hospitals') {
      return title.includes(searchQuery);
    }
    return title.includes(searchQuery) || benefits.includes(searchQuery) || category.includes(searchQuery);
  });


  return (
    <DefaultLayout>
      <section className="hero-banner">
        <h2>{t('title')}</h2>
        <p>{t('subtitle')}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {/* Global Search Bar */}
          <div className="search-container">
            <span style={{ padding: '8px', fontSize: '1.2rem' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* District Selector */}
          <div className="form-group" style={{ margin: '0 auto', width: '100%', maxWidth: '300px' }}>
            <select 
              id="districtSelect"
              className="form-control"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">{t('districtSelect')}</option>
              {DISTRICTS.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* About Box */}
      <section style={{ marginBottom: '40px' }}>
        <div className="card-item" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h3>📢 {t('aboutTitle')}</h3>
          <p style={{ marginTop: '12px' }}>{t('aboutDesc')}</p>
        </div>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Emergency Hotlines section */}
          {filteredEmergencies.length > 0 && (
            <section>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
                🚨 {t('emergency')}
              </h2>
              <div className="grid grid-cols-3">
                {filteredEmergencies.map((item) => (
                  <div className="card-item" key={item._id}>
                    <h3>{item.icon} {item.name[lang] || item.name.en}</h3>
                    <p>{item.description[lang] || item.description.en}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {item.contactNumber}
                      </span>
                      <a href={`tel:${item.contactNumber}`} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        {t('callNow')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hospitals section */}
          {filteredHospitals.length > 0 && (
            <section>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
                🏥 {t('healthcare')}
              </h2>
              <div className="grid grid-cols-2">
                {filteredHospitals.map((hosp) => (
                  <div className="card-item" key={hosp._id}>
                    <h3>🏥 {hosp.name[lang] || hosp.name.en}</h3>
                    <p>{hosp.description[lang] || hosp.description.en}</p>
                    <div className="card-metadata">
                      <span>📍 <strong>Address:</strong> {hosp.address[lang] || hosp.address.en}</span>
                      <span>📞 <strong>Contact:</strong> {hosp.contactNumber}</span>
                      <span>⚙️ <strong>Blood Bank:</strong> {hosp.hasBloodBank ? '✅ Available' : '❌ N/A'}</span>
                    </div>
                    {hosp.googleMapsUrl && (
                      <a 
                        href={hosp.googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-secondary"
                        style={{ marginTop: '12px', textAlign: 'center' }}
                      >
                        {t('viewLocation')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schemes section */}
          {filteredSchemes.length > 0 && (
            <section>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
                🌾 {t('schemes')}
              </h2>
              <div className="grid grid-cols-2">
                {filteredSchemes.map((scheme) => (
                  <div className="card-item" key={scheme._id}>
                    <h3>🎓 {scheme.title[lang] || scheme.title.en}</h3>
                    <p><strong>Benefits:</strong> {scheme.benefits[lang] || scheme.benefits.en}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Eligibility:</strong> {scheme.eligibilityCriteria[lang] || scheme.eligibilityCriteria.en}
                    </p>
                    {scheme.officialWebsiteUrl && (
                      <a 
                        href={scheme.officialWebsiteUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-primary"
                        style={{ marginTop: '12px', textAlign: 'center' }}
                      >
                        Official Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {searchQuery && filteredEmergencies.length === 0 && filteredHospitals.length === 0 && filteredSchemes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>No results matched "{searchQuery}"</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search terms or choosing a different district.</p>
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Home;
