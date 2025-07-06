import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const QAList = () => {
  const [qas, setQAs] = useState([]);
  const [newAnswers, setNewAnswers] = useState({});
  const [usernames, setUsernames] = useState({});
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchQAs();
  }, []);

  const fetchQAs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/qa`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQAs(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: This user has inventory access only.');
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load Q&As'
        );
      }
    }
  };

  const handleAnswerChange = (qaId, value) => {
    setNewAnswers({ ...newAnswers, [qaId]: value });
  };

  const handleUserChange = (qaId, value) => {
    setUsernames({ ...usernames, [qaId]: value });
  };

  const handleSubmitAnswer = async (qaId) => {
    const answer = newAnswers[qaId];
    const answeredBy = usernames[qaId];

    if (!answer || !answeredBy) {
      alert('Please enter both answer and name');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/qa/${qaId}/answers`, {
        text: answer,
        answeredBy,
      },
    {
      headers: { Authorization: `Bearer ${user.token}` },
    });
      await fetchQAs();
      setNewAnswers({ ...newAnswers, [qaId]: '' });
      setUsernames({ ...usernames, [qaId]: '' });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access denied: This user has inventory access only.');
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to submit answer'
        );
      }
    }
  };

  return (
    <>
      <BackButton url='/' className='back-button' />
      
      <section className="heading">
        <h1>Questions & Answers</h1>
      </section>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 20px',
        marginBottom: '40px'
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

        {qas.map((qa) => (
          <div key={qa._id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '16px',
            borderLeft: '3px solid #6c757d',
            overflow: 'hidden'
          }}>
            
            {/* Question Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ 
                margin: '0', 
                fontSize: '15px', 
                fontWeight: '600',
                color: '#2c3e50',
                lineHeight: '1.3'
              }}>
                {qa.question}
              </h3>
            </div>

            {/* Answers Section */}
            <div style={{ padding: '12px 16px' }}>
              {qa.answers.length > 0 ? (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Answers ({qa.answers.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {qa.answers.map((ans, idx) => (
                      <div key={idx} style={{
                        padding: '8px 10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #e9ecef'
                      }}>
                        <div style={{ 
                          fontSize: '13px', 
                          lineHeight: '1.4',
                          color: '#2c3e50',
                          marginBottom: '4px'
                        }}>
                          {ans.text}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#6c757d',
                          fontWeight: '500'
                        }}>
                          — {ans.answeredBy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  marginBottom: '12px',
                  padding: '8px 10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    margin: '0', 
                    fontStyle: 'italic', 
                    color: '#6c757d',
                    fontSize: '13px'
                  }}>
                    No answers yet. Be the first to contribute!
                  </p>
                </div>
              )}

              {/* Answer Input Section */}
              <div style={{
                borderTop: '1px solid #e9ecef',
                paddingTop: '12px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <textarea
                    placeholder="Write your answer..."
                    rows={2}
                    value={newAnswers[qa._id] || ''}
                    onChange={(e) => handleAnswerChange(qa._id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '13px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      resize: 'vertical',
                      backgroundColor: '#f8f9fa',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={usernames[qa._id] || ''}
                    onChange={(e) => handleUserChange(qa._id, e.target.value)}
                    style={{
                      width: '120px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#f8f9fa',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                  <button
                    onClick={() => handleSubmitAnswer(qa._id)}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      flex: '1',
                      maxWidth: '150px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    Add Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {qas.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6c757d'
          }}>
            <p style={{ fontSize: '16px', margin: '0' }}>
              No questions and answers available yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QAList;
