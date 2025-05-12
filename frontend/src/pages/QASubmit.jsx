import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QASubmit = () => {
  const [form, setForm] = useState({ question: '', answer: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/qa', form); // Full URL here
      setForm({ question: '', answer: '' });
      navigate('/qa/list');
    } catch (err) {
      console.error('Error submitting QA:', err);
      alert('Submission failed');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h1>Q&A Submission</h1>
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
