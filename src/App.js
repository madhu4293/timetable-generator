import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const [section, setSection] = useState('A');
  const [period, setPeriod] = useState(1);
  const [subject, setSubject] = useState('');
  const [faculty, setFaculty] = useState('');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch timetable data from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/timetable')
      .then(response => {
        setTimetable(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);  // No error message will be shown here
      });
  }, []);

  // Handle adding data to the timetable
  const handleAddToTimetable = () => {
    if (!subject || !faculty) {
      alert('Please enter both subject and faculty name');
      return;
    }

    // Send data to the backend to update the timetable
    axios.post('http://localhost:5000/api/timetable', {
      section,
      period,
      subject,
      faculty
    })
      .then(() => {
        setTimetable(prevTimetable => {
          const newTimetable = { ...prevTimetable };
          newTimetable[section][period - 1] = { subject, faculty };
          return newTimetable;
        });
        setSubject('');
        setFaculty('');
      })
      .catch(error => console.error('Error updating timetable:', error));
  };

  return (
    <div className="container">
      <h1>Timetable Generator</h1>

      {/* Show loading state */}
      {loading && <p>Loading timetable...</p>}

      {/* Form to add data to the timetable */}
      <div className="form-section">
        <label htmlFor="section">Select Section:</label>
        <select id="section" value={section} onChange={(e) => setSection(e.target.value)}>
          {sections.map(sec => (
            <option key={sec} value={sec}>Section {sec}</option>
          ))}
        </select>

        <label htmlFor="period">Period:</label>
        <select id="period" value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
          {Array.from({ length: 7 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Period {i + 1}</option>
          ))}
        </select>

        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />

        <label htmlFor="faculty">Faculty Name:</label>
        <input
          type="text"
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          placeholder="Enter faculty name"
        />
        <button onClick={handleAddToTimetable}>Add to Timetable</button>
      </div>

      {/* Render timetable for each section */}
      <h2>Timetable for All Sections</h2>
      {sections.map(sec => (
        <div key={sec} className="timetable">
          <h3>Timetable for Section {sec}</h3>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Subject</th>
                <th>Faculty</th>
              </tr>
            </thead>
            <tbody>
              {/* Render periods (1 to 7) */}
              {Array.from({ length: 7 }, (_, i) => (
                <tr key={i}>
                  <td>Period {i + 1}</td>
                  <td>{timetable[sec] && timetable[sec][i]?.subject || 'Not assigned'}</td>
                  <td>{timetable[sec] && timetable[sec][i]?.faculty || 'Not assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
