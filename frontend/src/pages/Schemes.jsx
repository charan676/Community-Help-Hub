import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import Spinner from '../components/common/Spinner';
import { schemes } from '../services/api';

export const Schemes = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  const [loading, setLoading] = useState(false);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Wizard States
  const [wizardAge, setWizardAge] = useState('');
  const [wizardIsStudent, setWizardIsStudent] = useState(false);
  const [wizardIsFarmer, setWizardIsFarmer] = useState(false);
  const [wizardGender, setWizardGender] = useState('general');
  const [filteredActive, setFilteredActive] = useState(false);

  useEffect(() => {
    if (!filteredActive) {
      fetchSchemes();
    }
  }, [selectedCategory, filteredActive]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemes.getAll({ category: selectedCategory });
      setSchemeList(res.data.schemes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFilteredActive(true);

    try {
      const res = await schemes.checkEligibility({
        age: wizardAge,
        isStudent: wizardIsStudent,
        isFarmer: wizardIsFarmer,
        gender: wizardGender
      });
      setSchemeList(res.data.schemes);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetWizard = () => {
    setWizardAge('');
    setWizardIsStudent(false);
    setWizardIsFarmer(false);
    setWizardGender('general');
    setFilteredActive(false);
  };

  return (
    <DefaultLayout>
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>🌾 {t('schemes')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Andhra Pradesh Welfare schemes for farmers, students, senior citizens, and women</p>
      </section>

      {/* Eligibility wizard box */}
      <section className="wizard-box" style={{ marginBottom: '48px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>🔍 {t('eligibilityWizard')}</h3>
        
        <form onSubmit={handleWizardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label>Age of Beneficiary</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 45"
              value={wizardAge}
              onChange={(e) => setWizardAge(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label>Gender</label>
            <select 
              className="form-control"
              value={wizardGender}
              onChange={(e) => setWizardGender(e.target.value)}
            >
              <option value="general">Male / General</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
            <label className="checkbox-group">
              <input 
                type="checkbox" 
                checked={wizardIsStudent} 
                onChange={(e) => setWizardIsStudent(e.target.checked)} 
              />
              <span>I am pursuing higher education / studies (Student)</span>
            </label>
            <label className="checkbox-group">
              <input 
                type="checkbox" 
                checked={wizardIsFarmer} 
                onChange={(e) => setWizardIsFarmer(e.target.checked)} 
              />
              <span>I own agricultural land / cultivate crops (Farmer)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {filteredActive && (
              <button type="button" className="btn btn-secondary" onClick={handleResetWizard} style={{ flex: 1 }}>
                Reset
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              Check Matching Schemes
            </button>
          </div>
        </form>
      </section>

      {/* Regular Filter tab */}
      {!filteredActive && (
        <section style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <div className="form-group" style={{ width: '250px' }}>
            <label>Filter by Category</label>
            <select 
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Schemes</option>
              <option value="student">For Students</option>
              <option value="farmer">For Farmers</option>
              <option value="women">For Women</option>
              <option value="senior">For Senior Citizens</option>
            </select>
          </div>
        </section>
      )}

      {filteredActive && (
        <div style={{ padding: '12px', marginBottom: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Wizards result: displaying matching schemes based on eligibility factors.</span>
          <button className="btn btn-secondary" onClick={handleResetWizard} style={{ padding: '4px 12px' }}>Reset Filters</button>
        </div>
      )}

      {/* Results grid */}
      <section>
        {loading ? (
          <Spinner />
        ) : schemeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <p>No welfare schemes matched the selection parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {schemeList.map((scheme) => (
              <div className="card-item" key={scheme._id} style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>🌾 {scheme.title[lang] || scheme.title.en}</h3>
                  <span className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'default' }}>
                    {scheme.category}
                  </span>
                </div>
                <p style={{ marginTop: '12px' }}><strong>Benefits:</strong> {scheme.benefits[lang] || scheme.benefits.en}</p>
                <div className="card-metadata" style={{ borderTop: '1px dashed var(--border)' }}>
                  <span>📋 <strong>Eligibility Criteria:</strong> {scheme.eligibilityCriteria[lang] || scheme.eligibilityCriteria.en}</span>
                </div>
                {scheme.officialWebsiteUrl && (
                  <a 
                    href={scheme.officialWebsiteUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary"
                    style={{ marginTop: '12px', textAlign: 'center' }}
                  >
                    Apply on Official Website
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

export default Schemes;
