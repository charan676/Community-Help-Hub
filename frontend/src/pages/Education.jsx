import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import Spinner from '../components/common/Spinner';
import { education } from '../services/api';

export const Education = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('');

  const fetchEducationResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await education.getAll(category);
      setResources(res.data.resources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEducationResources();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchEducationResources]);

  return (
    <DefaultLayout>
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>🎓 {t('education')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Access Central/State Scholarships, Skill Development modules, and Employment lists</p>
      </section>

      {/* Category filters */}
      <section style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <div className="form-group" style={{ width: '250px' }}>
          <label>Resource Filter</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Resources</option>
            <option value="courses">Free Courses</option>
            <option value="skills">Skill Portals</option>
            <option value="scholarship">Scholarship Systems</option>
            <option value="career_opportunities">Employment News & Jobs</option>
          </select>
        </div>
      </section>

      {/* Resources listing */}
      {loading ? (
        <Spinner />
      ) : resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
          <p>No resources found matching the category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {resources.map((item) => (
            <div className="card-item" key={item._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {item.category.replace('_', ' ')}
                </span>
                <span className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.65rem', cursor: 'default' }}>
                  {item.isFree ? 'FREE' : 'GOVT FEE'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>{item.title[lang] || item.title.en}</h3>
              <p style={{ marginTop: '8px', fontSize: '0.9rem', flex: 1 }}>{item.description[lang] || item.description.en}</p>
              <div className="card-metadata" style={{ marginTop: 'auto', borderTop: '1px dashed var(--border)' }}>
                <span>🏛️ <strong>Provider:</strong> {item.providerName}</span>
              </div>
              <a 
                href={item.linkUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{ textAlign: 'center', marginTop: '12px' }}
              >
                Visit Portal
              </a>
            </div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Education;
