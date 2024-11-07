import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimetableDisplay = ({ section }) => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:5000/api/timetable/${section}`);
      setTimetable(result.data);
    };
    fetchData();
  }, [section]);

  return (
    <div>
      <h2>Timetable for Section {section}</h2>
      <ul>
        {timetable.map((entry, index) => (
          <li key={index}>
            Period {entry.period}: {entry.subject}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimetableDisplay;
