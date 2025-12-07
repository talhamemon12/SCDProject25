const fs = require('fs');

// Realistic Pakistani names
const firstNames = [
  'Muhammad', 'Ahmed', 'Ali', 'Hassan', 'Hussain', 'Usman', 'Omar', 'Bilal', 'Hamza', 'Zain',
  'Fatima', 'Ayesha', 'Zainab', 'Maryam', 'Khadija', 'Amna', 'Hira', 'Sana', 'Aiza', 'Noor',
  'Abdullah', 'Ibrahim', 'Yusuf', 'Ismail', 'Khalid', 'Tariq', 'Faisal', 'Imran', 'Shahid', 'Asad',
  'Sadia', 'Rabia', 'Hina', 'Saima', 'Nadia', 'Farah', 'Mehreen', 'Anum', 'Alina', 'Mahnoor',
  'Arslan', 'Haider', 'Raza', 'Kamran', 'Salman', 'Adnan', 'Junaid', 'Aamir', 'Wasim', 'Fahad',
  'Zara', 'Iqra', 'Bushra', 'Uzma', 'Samina', 'Shazia', 'Rubina', 'Naila', 'Sidra', 'Maria',
  'Talha', 'Umar', 'Saad', 'Faizan', 'Danish', 'Rizwan', 'Shahzad', 'Muneeb', 'Nabeel', 'Waleed',
  'Hafsa', 'Alishba', 'Nimra', 'Laiba', 'Sehar', 'Areeba', 'Maha', 'Rida', 'Hoorain', 'Javeria',
  'Rehan', 'Affan', 'Hasan', 'Mohsin', 'Nauman', 'Atif', 'Kashif', 'Shoaib', 'Waqar', 'Nadeem'
];

const lastNames = [
  'Khan', 'Ahmed', 'Ali', 'Hussain', 'Hassan', 'Sheikh', 'Malik', 'Mahmood', 'Javed', 'Iqbal',
  'Akram', 'Aziz', 'Butt', 'Chaudhry', 'Rashid', 'Raza', 'Siddiqui', 'Mirza', 'Baig', 'Qureshi',
  'Shah', 'Zaidi', 'Haider', 'Naqvi', 'Rizvi', 'Abbasi', 'Ansari', 'Farooqui', 'Gillani', 'Durrani',
  'Bhatti', 'Chohan', 'Memon', 'Jamali', 'Laghari', 'Khoso', 'Baloch', 'Mengal', 'Marri', 'Bugti'
];

const cities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
  'Sialkot', 'Gujranwala', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Hyderabad', 'Abbottabad'
];

const professions = [
  'Software Engineer', 'Doctor', 'Teacher', 'Businessman', 'Lawyer', 'Accountant',
  'Civil Engineer', 'Architect', 'Banker', 'Marketing Manager'
];

const companies = [
  'Systems Limited', 'NETSOL Technologies', 'TPS', 'Engro Corporation', 'Lucky Cement',
  'Packages Limited', 'Habib Bank Limited', 'MCB Bank', 'UBL', 'Meezan Bank'
];

const universities = [
  'NUST', 'LUMS', 'FAST-NUCES', 'GIKI', 'COMSATS', 'Punjab University', 'Karachi University'
];

function generateRecord() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  const valueType = Math.random();
  let value;
  
  if (valueType < 0.4) {
    const position = professions[Math.floor(Math.random() * professions.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    value = `${position} at ${company}`;
  } else if (valueType < 0.6) {
    const university = universities[Math.floor(Math.random() * universities.length)];
    const degree = ['BS Computer Science', 'MS Software Engineering', 'BBA', 'MBA'][Math.floor(Math.random() * 4)];
    value = `${degree} from ${university}`;
  } else {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const profession = professions[Math.floor(Math.random() * professions.length)];
    value = `${profession} based in ${city}`;
  }
  
  const created = new Date(Date.now() - Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000));

  return { name, value, created };
}

// Generate 150 records
const records = [];
for (let i = 0; i < 150; i++) {
  records.push(generateRecord());
}

// Save as JSON array
fs.writeFileSync('records.json', JSON.stringify(records, null, 2));
console.log('✅ records.json created with 150 records');
