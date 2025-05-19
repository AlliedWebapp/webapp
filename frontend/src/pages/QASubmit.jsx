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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <BackButton url='/' className='back-button' />
      <h1>Q&A Submission</h1>
      {error && (
  <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
    {error}
  </div>
)}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          placeholder="Enter question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
        />
        <textarea
          placeholder="Enter answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QASubmit;
