import { useState, useEffect, useCallback } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { emergency, hospitals, schemes, feedback } from '../services/api';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('feedbacks');
  const [loading, setLoading] = useState(false);

  // Data Lists
  const [emergenciesList, setEmergenciesList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [schemesList, setSchemesList] = useState([]);
  const [feedbacksList, setFeedbacksList] = useState([]);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('hospital'); // hospital, scheme, emergency
  const [selectedItem, setSelectedItem] = useState(null); // for edit

  // Form States
  const [hospitalForm, setHospitalForm] = useState({
    nameEn: '', nameTe: '', descEn: '', descTe: '', phone: '', addrEn: '', addrTe: '',
    mapsUrl: '', lng: '', lat: '', districtCode: 'visakhapatnam', category: 'government',
    hasBloodBank: false, is24_7: true
  });

  const [schemeForm, setSchemeForm] = useState({
    titleEn: '', titleTe: '', category: 'general', eligEn: '', eligTe: '',
    benefitsEn: '', benefitsTe: '', siteUrl: '', districtCode: ''
  });

  const [emergencyForm, setEmergencyForm] = useState({
    nameEn: '', nameTe: '', icon: '📞', descEn: '', descTe: '', phone: '',
    category: 'other', districtCode: ''
  });

  const fetchTabData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'emergencies') {
        const res = await emergency.getAll();
        setEmergenciesList(res.data.services);
      } else if (activeTab === 'hospitals') {
        const res = await hospitals.getAll();
        setHospitalsList(res.data.hospitals);
      } else if (activeTab === 'schemes') {
        const res = await schemes.getAll();
        setSchemesList(res.data.schemes);
      } else if (activeTab === 'feedbacks') {
        const res = await feedback.getAll();
        setFeedbacksList(res.data.feedbacks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTabData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTabData]);

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      if (type === 'emergency') await emergency.delete(id);
      if (type === 'hospital') await hospitals.delete(id);
      if (type === 'scheme') await schemes.delete(id);
      fetchTabData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveFeedback = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'reviewed' : 'resolved';
    try {
      await feedback.updateStatus(id, nextStatus);
      fetchTabData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddModal = (type) => {
    setSelectedItem(null);
    setModalType(type);
    setIsModalOpen(true);
    // Reset forms
    if (type === 'hospital') {
      setHospitalForm({
        nameEn: '', nameTe: '', descEn: '', descTe: '', phone: '', addrEn: '', addrTe: '',
        mapsUrl: '', lng: '83.3', lat: '17.7', districtCode: 'visakhapatnam', category: 'government',
        hasBloodBank: false, is24_7: true
      });
    } else if (type === 'scheme') {
      setSchemeForm({
        titleEn: '', titleTe: '', category: 'general', eligEn: '', eligTe: '',
        benefitsEn: '', benefitsTe: '', siteUrl: '', districtCode: ''
      });
    } else if (type === 'emergency') {
      setEmergencyForm({
        nameEn: '', nameTe: '', icon: '📞', descEn: '', descTe: '', phone: '',
        category: 'other', districtCode: ''
      });
    }
  };

  const openEditModal = (type, item) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
    if (type === 'hospital') {
      setHospitalForm({
        nameEn: item.name.en || '',
        nameTe: item.name.te || '',
        descEn: item.description?.en || '',
        descTe: item.description?.te || '',
        phone: item.contactNumber || '',
        addrEn: item.address?.en || '',
        addrTe: item.address?.te || '',
        mapsUrl: item.googleMapsUrl || '',
        lng: item.location?.coordinates?.[0] || '83.3',
        lat: item.location?.coordinates?.[1] || '17.7',
        districtCode: item.districtCode || 'visakhapatnam',
        category: item.category || 'government',
        hasBloodBank: item.hasBloodBank || false,
        is24_7: item.is24_7 || false
      });
    } else if (type === 'scheme') {
      setSchemeForm({
        titleEn: item.title.en || '',
        titleTe: item.title.te || '',
        category: item.category || 'general',
        eligEn: item.eligibilityCriteria?.en || '',
        eligTe: item.eligibilityCriteria?.te || '',
        benefitsEn: item.benefits?.en || '',
        benefitsTe: item.benefits?.te || '',
        siteUrl: item.officialWebsiteUrl || '',
        districtCode: item.districtCode || ''
      });
    } else if (type === 'emergency') {
      setEmergencyForm({
        nameEn: item.name.en || '',
        nameTe: item.name.te || '',
        icon: item.icon || '📞',
        descEn: item.description?.en || '',
        descTe: item.description?.te || '',
        phone: item.contactNumber || '',
        category: item.category || 'other',
        districtCode: item.districtCode || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'hospital') {
        const body = {
          name: { en: hospitalForm.nameEn, te: hospitalForm.nameTe },
          description: { en: hospitalForm.descEn, te: hospitalForm.descTe },
          contactNumber: hospitalForm.phone,
          address: { en: hospitalForm.addrEn, te: hospitalForm.addrTe },
          googleMapsUrl: hospitalForm.mapsUrl,
          location: { type: 'Point', coordinates: [Number(hospitalForm.lng), Number(hospitalForm.lat)] },
          districtCode: hospitalForm.districtCode,
          category: hospitalForm.category,
          hasBloodBank: hospitalForm.hasBloodBank,
          is24_7: hospitalForm.is24_7
        };
        if (selectedItem) {
          await hospitals.update(selectedItem._id, body);
        } else {
          await hospitals.create(body);
        }
      } else if (modalType === 'scheme') {
        const body = {
          title: { en: schemeForm.titleEn, te: schemeForm.titleTe },
          category: schemeForm.category,
          eligibilityCriteria: { en: schemeForm.eligEn, te: schemeForm.eligTe },
          benefits: { en: schemeForm.benefitsEn, te: schemeForm.benefitsTe },
          officialWebsiteUrl: schemeForm.siteUrl,
          districtCode: schemeForm.districtCode || null
        };
        if (selectedItem) {
          await schemes.update(selectedItem._id, body);
        } else {
          await schemes.create(body);
        }
      } else if (modalType === 'emergency') {
        const body = {
          name: { en: emergencyForm.nameEn, te: emergencyForm.nameTe },
          icon: emergencyForm.icon,
          description: { en: emergencyForm.descEn, te: emergencyForm.descTe },
          contactNumber: emergencyForm.phone,
          category: emergencyForm.category,
          districtCode: emergencyForm.districtCode || null
        };
        if (selectedItem) {
          await emergency.update(selectedItem._id, body);
        } else {
          await emergency.create(body);
        }
      }

      setIsModalOpen(false);
      fetchTabData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DefaultLayout>
      <section style={{ marginBottom: '32px' }}>
        <h2>🛡️ Administrative Console</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the Community Help Hub Control Board</p>
      </section>

      {/* Tab controls */}
      <section style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '32px' }}>
        <button className={`btn ${activeTab === 'feedbacks' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('feedbacks')}>
          Citizen Feedbacks
        </button>
        <button className={`btn ${activeTab === 'hospitals' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('hospitals')}>
          Manage Hospitals
        </button>
        <button className={`btn ${activeTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('schemes')}>
          Manage Schemes
        </button>
        <button className={`btn ${activeTab === 'emergencies' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('emergencies')}>
          Emergency Services
        </button>
      </section>

      {/* CRUD Controls */}
      {activeTab !== 'feedbacks' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button className="btn btn-primary" onClick={() => openAddModal(activeTab === 'emergencies' ? 'emergency' : activeTab.slice(0, -1))}>
            + Add New {(activeTab === 'emergencies' ? 'emergency' : activeTab.slice(0, -1)).toUpperCase()}
          </button>
        </div>
      )}

      {/* Main Table Content */}
      <section className="card-item" style={{ overflowX: 'auto', padding: '0', borderRadius: 'var(--radius-md)' }}>
        {loading ? (
          <Spinner />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
                {activeTab === 'feedbacks' && (
                  <>
                    <th style={{ padding: '16px' }}>Name / Email</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Message</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Action</th>
                  </>
                )}
                {activeTab === 'hospitals' && (
                  <>
                    <th style={{ padding: '16px' }}>Hospital Name</th>
                    <th style={{ padding: '16px' }}>District</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Contact</th>
                    <th style={{ padding: '16px' }}>Action</th>
                  </>
                )}
                {activeTab === 'schemes' && (
                  <>
                    <th style={{ padding: '16px' }}>Scheme Title</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Official URL</th>
                    <th style={{ padding: '16px' }}>Action</th>
                  </>
                )}
                {activeTab === 'emergencies' && (
                  <>
                    <th style={{ padding: '16px' }}>Hotline Name</th>
                    <th style={{ padding: '16px' }}>Hotline No.</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'feedbacks' && feedbacksList.map((fb) => (
                <tr key={fb._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <strong>{fb.name}</strong> <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{fb.email}</span>
                  </td>
                  <td style={{ padding: '16px', textTransform: 'capitalize' }}>{fb.category.replace('_', ' ')}</td>
                  <td style={{ padding: '16px', maxWidth: '300px' }}>{fb.message}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: fb.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : (fb.status === 'reviewed' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                      color: fb.status === 'resolved' ? 'var(--success)' : (fb.status === 'reviewed' ? 'var(--warning)' : 'var(--error)')
                    }}>
                      {fb.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {fb.status !== 'resolved' && (
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleResolveFeedback(fb._id, fb.status)}>
                        {fb.status === 'pending' ? 'Review' : 'Resolve'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {activeTab === 'hospitals' && hospitalsList.map((hosp) => (
                <tr key={hosp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <strong>{hosp.name.en}</strong> <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{hosp.name.te}</span>
                  </td>
                  <td style={{ padding: '16px', textTransform: 'uppercase' }}>{hosp.districtCode}</td>
                  <td style={{ padding: '16px', textTransform: 'capitalize' }}>{hosp.category}</td>
                  <td style={{ padding: '16px' }}>{hosp.contactNumber}</td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => openEditModal('hospital', hosp)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete('hospital', hosp._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'schemes' && schemesList.map((scheme) => (
                <tr key={scheme._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <strong>{scheme.title.en}</strong> <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{scheme.title.te}</span>
                  </td>
                  <td style={{ padding: '16px', textTransform: 'capitalize' }}>{scheme.category}</td>
                  <td style={{ padding: '16px' }}>
                    <a href={scheme.officialWebsiteUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      Visit Web
                    </a>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => openEditModal('scheme', scheme)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete('scheme', scheme._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'emergencies' && emergenciesList.map((e) => (
                <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <strong>{e.icon} {e.name.en}</strong> <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{e.name.te}</span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{e.contactNumber}</td>
                  <td style={{ padding: '16px', textTransform: 'capitalize' }}>{e.category}</td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => openEditModal('emergency', e)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete('emergency', e._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* CRUD modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${selectedItem ? 'Edit' : 'Add New'} ${modalType.toUpperCase()}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {modalType === 'hospital' && (
            <>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Hospital Name (English)</label>
                <input type="text" className="form-control" value={hospitalForm.nameEn} onChange={(e) => setHospitalForm({ ...hospitalForm, nameEn: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Hospital Name (Telugu)</label>
                <input type="text" className="form-control" value={hospitalForm.nameTe} onChange={(e) => setHospitalForm({ ...hospitalForm, nameTe: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Description (English)</label>
                <textarea className="form-control" rows="3" value={hospitalForm.descEn} onChange={(e) => setHospitalForm({ ...hospitalForm, descEn: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Description (Telugu)</label>
                <textarea className="form-control" rows="3" value={hospitalForm.descTe} onChange={(e) => setHospitalForm({ ...hospitalForm, descTe: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Phone Number</label>
                <input type="text" className="form-control" value={hospitalForm.phone} onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Address (English)</label>
                <input type="text" className="form-control" value={hospitalForm.addrEn} onChange={(e) => setHospitalForm({ ...hospitalForm, addrEn: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Address (Telugu)</label>
                <input type="text" className="form-control" value={hospitalForm.addrTe} onChange={(e) => setHospitalForm({ ...hospitalForm, addrTe: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>District Code</label>
                <select className="form-control" value={hospitalForm.districtCode} onChange={(e) => setHospitalForm({ ...hospitalForm, districtCode: e.target.value })}>
                  <option value="visakhapatnam">Visakhapatnam</option>
                  <option value="anakapalle">Anakapalle</option>
                  <option value="alluri">Alluri Sitharama Raju</option>
                  <option value="guntur">Guntur</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Category</label>
                <select className="form-control" value={hospitalForm.category} onChange={(e) => setHospitalForm({ ...hospitalForm, category: e.target.value })}>
                  <option value="government">Government Hospital</option>
                  <option value="private">Private Hospital</option>
                  <option value="PHC">Primary Health Centre</option>
                  <option value="blood_bank">Blood Bank</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
                <label className="checkbox-group">
                  <input type="checkbox" checked={hospitalForm.hasBloodBank} onChange={(e) => setHospitalForm({ ...hospitalForm, hasBloodBank: e.target.checked })} />
                  <span>Has Blood Bank</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={hospitalForm.is24_7} onChange={(e) => setHospitalForm({ ...hospitalForm, is24_7: e.target.checked })} />
                  <span>Is 24/7 Open</span>
                </label>
              </div>
            </>
          )}

          {modalType === 'scheme' && (
            <>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Scheme Title (English)</label>
                <input type="text" className="form-control" value={schemeForm.titleEn} onChange={(e) => setSchemeForm({ ...schemeForm, titleEn: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Scheme Title (Telugu)</label>
                <input type="text" className="form-control" value={schemeForm.titleTe} onChange={(e) => setSchemeForm({ ...schemeForm, titleTe: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Benefits (English)</label>
                <textarea className="form-control" rows="3" value={schemeForm.benefitsEn} onChange={(e) => setSchemeForm({ ...schemeForm, benefitsEn: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Benefits (Telugu)</label>
                <textarea className="form-control" rows="3" value={schemeForm.benefitsTe} onChange={(e) => setSchemeForm({ ...schemeForm, benefitsTe: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Eligibility (English)</label>
                <textarea className="form-control" rows="3" value={schemeForm.eligEn} onChange={(e) => setSchemeForm({ ...schemeForm, eligEn: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Eligibility (Telugu)</label>
                <textarea className="form-control" rows="3" value={schemeForm.eligTe} onChange={(e) => setSchemeForm({ ...schemeForm, eligTe: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Category</label>
                <select className="form-control" value={schemeForm.category} onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}>
                  <option value="general">General</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="women">Women</option>
                  <option value="senior">Senior Citizen</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>District (Optional)</label>
                <select className="form-control" value={schemeForm.districtCode} onChange={(e) => setSchemeForm({ ...schemeForm, districtCode: e.target.value })}>
                  <option value="">State-wide (All Districts)</option>
                  <option value="visakhapatnam">Visakhapatnam</option>
                  <option value="anakapalle">Anakapalle</option>
                  <option value="alluri">Alluri Sitharama Raju</option>
                  <option value="guntur">Guntur</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Official Web URL</label>
                <input type="text" className="form-control" value={schemeForm.siteUrl} onChange={(e) => setSchemeForm({ ...schemeForm, siteUrl: e.target.value })} />
              </div>
            </>
          )}

          {modalType === 'emergency' && (
            <>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Name (English)</label>
                <input type="text" className="form-control" value={emergencyForm.nameEn} onChange={(e) => setEmergencyForm({ ...emergencyForm, nameEn: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Name (Telugu)</label>
                <input type="text" className="form-control" value={emergencyForm.nameTe} onChange={(e) => setEmergencyForm({ ...emergencyForm, nameTe: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Description (English)</label>
                <textarea className="form-control" rows="3" value={emergencyForm.descEn} onChange={(e) => setEmergencyForm({ ...emergencyForm, descEn: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Description (Telugu)</label>
                <textarea className="form-control" rows="3" value={emergencyForm.descTe} onChange={(e) => setEmergencyForm({ ...emergencyForm, descTe: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Contact Number</label>
                <input type="text" className="form-control" value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Emoji Icon</label>
                <input type="text" className="form-control" value={emergencyForm.icon} onChange={(e) => setEmergencyForm({ ...emergencyForm, icon: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Category</label>
                <select className="form-control" value={emergencyForm.category} onChange={(e) => setEmergencyForm({ ...emergencyForm, category: e.target.value })}>
                  <option value="medical">Medical</option>
                  <option value="police">Police</option>
                  <option value="fire">Fire</option>
                  <option value="disaster">Disaster</option>
                  <option value="women">Women</option>
                  <option value="child">Child</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>District (Optional)</label>
                <select className="form-control" value={emergencyForm.districtCode} onChange={(e) => setEmergencyForm({ ...emergencyForm, districtCode: e.target.value })}>
                  <option value="">State-wide (All Districts)</option>
                  <option value="visakhapatnam">Visakhapatnam</option>
                  <option value="anakapalle">Anakapalle</option>
                  <option value="alluri">Alluri Sitharama Raju</option>
                  <option value="guntur">Guntur</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
          </div>
        </form>
      </Modal>
    </DefaultLayout>
  );
};

export default AdminDashboard;
