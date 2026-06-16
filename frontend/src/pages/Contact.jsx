import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layouts/DefaultLayout';
import { feedback } from '../services/api';

export const Contact = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('suggestion');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMessage) {
      setFeedbackError('Please complete all form fields.');
      return;
    }

    setSubmittingFeedback(true);
    setFeedbackError('');
    setFeedbackSuccess('');

    try {
      await feedback.submit({
        name: feedbackName,
        email: feedbackEmail,
        message: feedbackMessage,
        category: feedbackCategory
      });
      setFeedbackSuccess(lang === 'te' ? 'సహాయ హబ్‌కు మీ అభిప్రాయం పంపబడింది. ధన్యవాదాలు!' : 'Feedback submitted successfully. Thank you!');
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (err) {
      setFeedbackError(err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <DefaultLayout>
      <section style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2>💬 {t('feedbackTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Get in touch with us, report service issues, or submit feedback regarding government welfare schemes.</p>
      </section>

      {/* Feedback & Support Request Form */}
      <section style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '60px' }}>
        <form onSubmit={handleFeedbackSubmit} className="card-item" style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
          {feedbackSuccess && (
            <div style={{ color: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              {feedbackSuccess}
            </div>
          )}
          {feedbackError && (
            <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              {feedbackError}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Your Name"
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Your Email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Feedback Category</label>
            <select 
              className="form-control"
              value={feedbackCategory}
              onChange={(e) => setFeedbackCategory(e.target.value)}
            >
              <option value="suggestion">General Suggestion</option>
              <option value="complaint">Welfare Complaint / Issue</option>
              <option value="emergency_issue">Emergency Service Bug Report</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Feedback Message</label>
            <textarea 
              className="form-control" 
              rows="4" 
              placeholder={t('feedbackPlaceholder')}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={submittingFeedback}
          >
            {submittingFeedback ? 'Submitting...' : t('submit')}
          </button>
        </form>
      </section>
    </DefaultLayout>
  );
};

export default Contact;
