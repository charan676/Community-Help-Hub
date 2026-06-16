import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import Spinner from '../components/common/Spinner';
import { emergency } from '../services/api';

export const Emergency = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  

  const fetchEmergencies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await emergency.getAll();
      setContacts(res.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmergencies();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEmergencies]);


  return (
    <DefaultLayout>
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>🚨 {t('emergency')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>24/7 State-wide Support and Rescue Networks</p>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-3" style={{ marginBottom: '60px' }}>
          {contacts.map((contact) => (
            <div className="card-item" key={contact._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{contact.icon}</span>
                <h3>{contact.name[lang] || contact.name.en}</h3>
              </div>
              <p>{contact.description[lang] || contact.description.en}</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {contact.contactNumber}
                </span>
                <a href={`tel:${contact.contactNumber}`} className="btn btn-primary">
                  {t('callNow')}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </DefaultLayout>
  );
};

export default Emergency;
