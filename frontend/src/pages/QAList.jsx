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
        setError('Access denied');
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
        setError('Access denied');
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to submit answer'
        );
      }
    }
  };
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '2rem' }}>
      <BackButton url='/' className='back-button' />
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>Questions & Answers</h1>
       {error ? (
      <div style={{ color: 'red', marginBottom: '1.5rem', textAlign: 'center' }}>
        {error}
      </div>
    ) : null}
      {qas.map((qa) => (
        <div key={qa._id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          {/* Question Title */}
          <h2 style={{ fontWeight: '600', fontSize: '1.4rem', marginBottom: '1rem' }}>{qa.question}</h2>

          {/* Answer List */}
          {qa.answers.length > 0 ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Answers:</h4>
              <ul style={{ paddingLeft: '1rem' }}>
                {qa.answers.map((ans, idx) => (
                  <li key={idx} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>{ans.text}</div>
                    <div style={{ fontSize: '0.875rem', color: '#555' }}>— {ans.answeredBy}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#777' }}>No answers yet.</p>
          )}

          {/* Answer Input */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <textarea
              placeholder="Write your answer..."
              rows={4}
              value={newAnswers[qa._id] || ''}
              onChange={(e) => handleAnswerChange(qa._id, e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
            <input
              type="text"
              placeholder="Your name"
              value={usernames[qa._id] || ''}
              onChange={(e) => handleUserChange(qa._id, e.target.value)}
              style={{
                marginTop: '0.5rem',
                width: '50%',
                padding: '8px',
                fontSize: '0.9rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <br />
            <button
              onClick={() => handleSubmitAnswer(qa._id)}
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#2e69ff',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Answer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QAList;
