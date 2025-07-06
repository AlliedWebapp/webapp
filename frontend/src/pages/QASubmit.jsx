//submitting Ques Ans
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_BASE_URL;
const QASubmit = () => {
  const [form, setForm] = useState({ question: '', answer: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    const submitButton = e.target.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_URL}/api/qa`, form, {
        headers: { 'Authorization': `Bearer ${user.token}` }
    });
        setForm({ question: '', answer: '' });
        navigate('/qa/list');
      } catch (err) {
       // Show access denied if 403, otherwise generic error
      if (err.response && err.response.status === 403) {
        setError('Access denied: This user has inventory access only.');
      } else {
        setError(
          err.response?.data?.message ||
          'Submission failed'
        );
      }
      // Re-enable submit button on error
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackButton url='/' className='back-button' />
      
      <section className="heading">
        <h1>Q&A Submission</h1>
      </section>

      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '0 20px'
      }}>
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            padding: '12px 16px', 
            marginBottom: '20px', 
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '3px solid #6c757d'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="question" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                Question *
              </label>
              <textarea
                id="question"
                placeholder="Enter your question..."
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                required
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f8f9fa'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="answer" style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333',
                fontSize: '14px'
              }}>
                Answer *
              </label>
              <textarea
                id="answer"
                placeholder="Enter your answer..."
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                required
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f8f9fa'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div className="form-group" style={{ textAlign: 'center' }}>
              <button 
                type="submit" 
                className="submit-btn btn btn-block" 
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#495057' : '#495057',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  minWidth: '120px'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QASubmit;
