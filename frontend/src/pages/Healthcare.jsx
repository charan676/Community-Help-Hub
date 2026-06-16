import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import LeafletMap from '../components/maps/LeafletMap';
import Spinner from '../components/common/Spinner';
import useGeoLocation from '../hooks/useGeoLocation';
import { hospitals } from '../services/api';

const AP_DISTRICTS = [
  { code: 'anakapalle', name: 'Anakapalle' },
  { code: 'visakhapatnam', name: 'Visakhapatnam' },
  { code: 'guntur', name: 'Guntur' },
  { code: 'kakinada', name: 'Kakinada' },
  { code: 'ysrkadapa', name: 'YSR Kadapa' }
];

export const Healthcare = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  const [loading, setLoading] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  
  // Filtering States
  const [district, setDistrict] = useState(localStorage.getItem('selectedDistrict') || '');
  const [category, setCategory] = useState('');
  const [searchWord, setSearchWord] = useState('');
  
  // Nearby lookup state
  const { coordinates, error: geoError, refetch: getGps } = useGeoLocation();
  const [nearbyActive, setNearbyActive] = useState(false);
  const [searchRadius, setSearchRadius] = useState(25); // km

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await hospitals.getAll({
        districtCode: district,
        category: category,
        search: searchWord
      });
      setHospitalList(res.data.hospitals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [district, category, searchWord]);

  useEffect(() => {
    if (!nearbyActive) {
      const timer = setTimeout(() => {
        fetchHospitals();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [fetchHospitals, nearbyActive]);

  const handleNearbySearch = async () => {
    getGps(); // Request location refresh
    if (!coordinates.lat || !coordinates.lng) {
      alert(geoError ? geoError.message : "Fetching geolocation coordinates... Please try again.");
      return;
    }

    setLoading(true);
    setNearbyActive(true);

    try {
      const res = await hospitals.getNearby(coordinates.lat, coordinates.lng, searchRadius);
      setHospitalList(res.data.hospitals);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearNearby = () => {
    setNearbyActive(false);
  };

  // Center coordinate mapping based on selected district to center map
  const getMapCenter = () => {
    if (nearbyActive && coordinates.lat && coordinates.lng) {
      return [coordinates.lat, coordinates.lng];
    }
    
    // Default district coordinate coordinates
    if (district === 'anakapalle') return [17.6896, 83.0039];
    if (district === 'visakhapatnam') return [17.7034, 83.3032];
    return [17.6896, 83.0039]; // default Anakapalle Area Hospital center
  };

  return (
    <DefaultLayout>
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>🏥 {t('healthcare')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Find Government Hospitals, Primary Health Centres, and Blood Banks</p>
      </section>

      {/* Geolocation Nearby trigger */}
      <section className="card-item" style={{ maxWidth: '800px', margin: '0 auto 40px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4>📍 Location Discovery</h4>
          <p style={{ margin: '0', fontSize: '0.9rem' }}>
            Find hospitals located within a specific radius of your GPS position.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            className="form-control"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            style={{ width: '120px' }}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>

          {nearbyActive ? (
            <button className="btn btn-secondary" onClick={clearNearby}>
              Reset Filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNearbySearch}>
              🔍 {t('nearbyServices')}
            </button>
          )}
        </div>
      </section>

      {/* Filter panel */}
      {!nearbyActive && (
        <section className="grid grid-cols-3" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label>{t('districtSelect')}</label>
            <select className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {AP_DISTRICTS.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Service Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t('allCategories')}</option>
              <option value="government">Government Hospital</option>
              <option value="private">Private Clinic / Hospital</option>
              <option value="PHC">Primary Health Centre</option>
              <option value="blood_bank">Blood Bank</option>
            </select>
          </div>

          <div className="form-group">
            <label>Search Keyword</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by hospital name..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
          </div>
        </section>
      )}

      {nearbyActive && (
        <div style={{ padding: '12px', marginBottom: '24px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing hospitals within <strong>{searchRadius}km</strong> of your location.</span>
          <button className="btn btn-secondary" onClick={clearNearby} style={{ padding: '4px 12px' }}>Clear Geolocation</button>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <LeafletMap 
        hospitals={hospitalList} 
        center={getMapCenter()} 
        zoom={nearbyActive ? 11 : (district ? 12 : 9)} 
      />

      {/* Link widgets */}
      <div className="grid grid-cols-2" style={{ marginBottom: '40px' }}>
        <div className="card-item" style={{ textAlign: 'center' }}>
          <h3>🩸 {t('bloodBank')}</h3>
          <p>Verify direct blood category availability and location parameters via e-RaktKosh.</p>
          <a href="https://eraktkosh.mohfw.gov.in/" target="_blank" rel="noreferrer" className="btn btn-secondary">
            Visit e-RaktKosh Portal
          </a>
        </div>
        <div className="card-item" style={{ textAlign: 'center' }}>
          <h3>💊 {t('primaryHealth')}</h3>
          <p>Access state-wide primary healthcare, vaccinations, and maternal clinics lists.</p>
          <a href="https://qps.nhsrcindia.org/node/1825" target="_blank" rel="noreferrer" className="btn btn-secondary">
            View PHC Registry
          </a>
        </div>
      </div>

      {/* Directory list */}
      <section>
        <h3 style={{ marginBottom: '20px' }}>Hospital Records ({hospitalList.length})</h3>
        
        {loading ? (
          <Spinner />
        ) : hospitalList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <p>No hospitals found matching selected search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {hospitalList.map((hosp) => (
              <div className="card-item" key={hosp._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>🏥 {hosp.name[lang] || hosp.name.en}</h3>
                  <span className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'default' }}>
                    {hosp.category.toUpperCase()}
                  </span>
                </div>
                <p style={{ marginTop: '8px' }}>{hosp.description?.[lang] || hosp.description?.en}</p>
                <div className="card-metadata">
                  <span>📍 <strong>Address:</strong> {hosp.address[lang] || hosp.address.en}</span>
                  <span>📞 <strong>Contact:</strong> {hosp.contactNumber}</span>
                  <span>⚙️ <strong>Operating Hours:</strong> {hosp.is24_7 ? '24/7 Support' : 'Standard OPD'}</span>
                </div>
                {hosp.googleMapsUrl && (
                  <a 
                    href={hosp.googleMapsUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary"
                    style={{ marginTop: '12px', textAlign: 'center' }}
                  >
                    Get Directions
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
};

export default Healthcare;
