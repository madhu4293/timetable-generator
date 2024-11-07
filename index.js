const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample timetable data for sections A to I
let timetableData = {
  A: Array(7).fill({ subject: '', faculty: '' }),
  B: Array(7).fill({ subject: '', faculty: '' }),
  C: Array(7).fill({ subject: '', faculty: '' }),
  D: Array(7).fill({ subject: '', faculty: '' }),
  E: Array(7).fill({ subject: '', faculty: '' }),
  F: Array(7).fill({ subject: '', faculty: '' }),
  G: Array(7).fill({ subject: '', faculty: '' }),
  H: Array(7).fill({ subject: '', faculty: '' }),
  I: Array(7).fill({ subject: '', faculty: '' }),
};

// Serve API route for timetable data (GET)
app.get('/api/timetable', (req, res) => {
  res.json(timetableData); // Return the timetable data as JSON
});

// API route to update timetable (POST)
app.post('/api/timetable', (req, res) => {
  const { section, period, subject, faculty } = req.body;

  if (section && period >= 1 && period <= 7 && subject && faculty) {
    // Update the timetable for the given section and period
    timetableData[section][period - 1] = { subject, faculty };
    res.json({ message: 'Timetable updated successfully', timetable: timetableData });
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Serve HTML page showing timetable directly (GET)
app.get('/', (req, res) => {
  let html = `
    <html>
      <head>
        <title>Timetable Generator</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f7f7f7;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #2a9d8f;
          }
          h2 {
            color: #e76f51;
          }
          h3 {
            color: #264653;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #2a9d8f;
            color: white;
          }
          td {
            background-color: #f4f4f4;
          }
          tr:nth-child(even) td {
            background-color: #e9ecef;
          }
          button {
            padding: 10px;
            margin-top: 20px;
            background-color: #2a9d8f;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #1f7c6f;
          }
        </style>
      </head>
      <body>
        <h1>Timetable Generator</h1>
        
        <!-- Form to add data to the timetable -->
        <div style="text-align: center;">
          <label for="section">Select Section:</label>
          <select id="section" name="section">
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
            <option value="E">Section E</option>
            <option value="F">Section F</option>
            <option value="G">Section G</option>
            <option value="H">Section H</option>
            <option value="I">Section I</option>
          </select>

          <label for="period">Period:</label>
          <select id="period" name="period">
            <option value="1">Period 1</option>
            <option value="2">Period 2</option>
            <option value="3">Period 3</option>
            <option value="4">Period 4</option>
            <option value="5">Period 5</option>
            <option value="6">Period 6</option>
            <option value="7">Period 7</option>
          </select>

          <label for="subject">Subject:</label>
          <input type="text" id="subject" name="subject" placeholder="Enter subject" />

          <label for="faculty">Faculty Name:</label>
          <input type="text" id="faculty" name="faculty" placeholder="Enter faculty name" />

          <button onclick="addToTimetable()">Add to Timetable</button>
        </div>

        <h2>Timetable for All Sections</h2>
  `;

  // Generate timetable HTML for each section
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  sections.forEach(section => {
    html += `
      <h3>Timetable for Section ${section}</h3>
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Subject</th>
            <th>Faculty</th>
          </tr>
        </thead>
        <tbody>
    `;
    for (let i = 0; i < 7; i++) {
      const subject = timetableData[section][i].subject || 'Not assigned';
      const faculty = timetableData[section][i].faculty || 'Not assigned';
      html += `
        <tr>
          <td>Period ${i + 1}</td>
          <td>${subject}</td>
          <td>${faculty}</td>
        </tr>
      `;
    }
    html += `</tbody></table>`;
  });

  html += `
        </div>

        <script>
          function addToTimetable() {
            const section = document.getElementById('section').value;
            const period = parseInt(document.getElementById('period').value);
            const subject = document.getElementById('subject').value;
            const faculty = document.getElementById('faculty').value;

            if (!section || !period || !subject || !faculty) {
              alert('Please fill in all fields');
              return;
            }

            // Send a POST request to update the timetable
            fetch('/api/timetable', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ section, period, subject, faculty })
            })
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                alert('Timetable updated successfully!');
                location.reload(); // Reload the page to see the updated timetable
              } else {
                alert('Error updating timetable');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          }
        </script>
      </body>
    </html>
  `;

  // Send the HTML response to the client
  res.send(html);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
