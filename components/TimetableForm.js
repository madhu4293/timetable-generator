import React, { useState } from 'react';
import axios from 'axios';

const TimetableForm = ({ onAdd }) => {
  const [section, setSection] = useState('A');
  const [period, setPeriod] = useState(1);
  const [subject, setSubject] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This is where the data will eventually be sent to the backend
    await axios.post('http://localhost:5000/api/timetable', { section, period, subject });
    onAdd();  // Notify parent component to refresh
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={section} onChange={(e) => setSection(e.target.value)}>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map(sec => (
          <option key={sec} value={sec}>{sec}</option>
        ))}
      </select>
      <input
        type="number"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        placeholder="Period"
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
      />
      <button type="submit">Add to Timetable</button>
    </form>
  );
};

export default TimetableForm;
