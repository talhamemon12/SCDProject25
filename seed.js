const mongoose = require('mongoose');
const Record = require('./models/Record');

const uri = 'mongodb://localhost:27017/nodevault';

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
  'Sialkot', 'Gujranwala', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Hyderabad', 'Abbottabad',
  'Mardan', 'Mingora', 'Sahiwal', 'Sheikhupura', 'Jhelum', 'Gujrat', 'Rahim Yar Khan',
  'Kasur', 'Dera Ghazi Khan', 'Nawabshah', 'Larkana', 'Mirpur Khas', 'Chiniot', 'Kamoke'
];

const professions = [
  'Software Engineer', 'Doctor', 'Teacher', 'Businessman', 'Lawyer', 'Accountant',
  'Civil Engineer', 'Architect', 'Banker', 'Marketing Manager', 'HR Manager', 'Data Analyst',
  'Graphic Designer', 'Pharmacist', 'Dentist', 'Professor', 'Government Officer', 'Consultant',
  'Entrepreneur', 'Sales Manager', 'Project Manager', 'Web Developer', 'Mobile App Developer',
  'Network Engineer', 'System Administrator', 'Content Writer', 'Journalist', 'Photographer',
  'Interior Designer', 'Fashion Designer', 'Chef', 'Restaurant Owner', 'Real Estate Agent',
  'Insurance Agent', 'Financial Advisor', 'Tax Consultant', 'IT Manager', 'Security Officer'
];

const companies = [
  'Systems Limited', 'NETSOL Technologies', 'TPS', 'Engro Corporation', 'Lucky Cement',
  'Packages Limited', 'Habib Bank Limited', 'MCB Bank', 'UBL', 'Meezan Bank', 'Askari Bank',
  'Pakistan Telecommunication Company', 'Telenor Pakistan', 'Jazz (Mobilink)', 'Zong',
  'K-Electric', 'PTCL', 'Nestle Pakistan', 'Unilever Pakistan', 'Procter & Gamble',
  'Colgate-Palmolive', 'GlaxoSmithKline', 'Abbott Laboratories', 'Novartis', 'Pfizer',
  'Fatima Group', 'Nishat Group', 'Dawood Group', 'Hashoo Group', 'Serena Hotels',
  'Pakistan International Airlines', 'National Bank of Pakistan', 'State Bank of Pakistan',
  'OGDCL', 'PSO', 'Shell Pakistan', 'Total PARCO', 'Byco Petroleum', 'Sui Northern Gas',
  'Tech Valley', 'Arbisoft', 'Inbox Business Technologies', '10Pearls', 'Confiz Solutions'
];

const universities = [
  'NUST', 'LUMS', 'FAST-NUCES', 'GIKI', 'COMSATS', 'Punjab University', 'Karachi University',
  'IBA Karachi', 'NED University', 'UET Lahore', 'UET Taxila', 'Quaid-i-Azam University',
  'Bahria University', 'Air University', 'PIEAS', 'BNU', 'Habib University', 'IU Islamabad',
  'Aga Khan University', 'Dow University', 'King Edward Medical University', 'SZABMU',
  'University of Agriculture Faisalabad', 'LUMS', 'ITU Lahore', 'University of Karachi'
];

const valueTypes = [
  'Employee at',
  'Manager at',
  'Senior Developer at',
  'Team Lead at',
  'Director at',
  'CEO of',
  'Consultant at',
  'Freelancer',
  'Student at',
  'Graduate from',
  'Resident of',
  'Owner of'
];

// Generate random record
function generateRecord() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  const valueType = Math.random();
  let value;
  
  if (valueType < 0.4) {
    // Company employee
    const position = professions[Math.floor(Math.random() * professions.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    value = `${position} at ${company}`;
  } else if (valueType < 0.6) {
    // Student/Graduate
    const university = universities[Math.floor(Math.random() * universities.length)];
    const degree = ['BS Computer Science', 'MS Software Engineering', 'BBA', 'MBA', 'BE Electrical', 
                   'BE Mechanical', 'MBBS', 'BDS', 'PharmD', 'LLB', 'BS Mathematics'][Math.floor(Math.random() * 11)];
    value = `${degree} from ${university}`;
  } else if (valueType < 0.8) {
    // City resident with profession
    const city = cities[Math.floor(Math.random() * cities.length)];
    const profession = professions[Math.floor(Math.random() * professions.length)];
    value = `${profession} based in ${city}`;
  } else {
    // Business owner
    const city = cities[Math.floor(Math.random() * cities.length)];
    const business = ['Software House', 'Restaurant', 'Trading Company', 'Construction Company',
                     'Retail Store', 'Import/Export Business', 'Textile Mill', 'Consultancy Firm',
                     'Real Estate Agency', 'Medical Clinic'][Math.floor(Math.random() * 10)];
    value = `Owner of ${business} in ${city}`;
  }
  
  // Random date within last 2 years
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000));
  
  return {
    name,
    value,
    created: randomDate
  };
}

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing records
    await Record.deleteMany({});
    console.log('🗑️  Cleared existing records');

    // Generate 150 records
    const records = [];
    for (let i = 0; i < 150; i++) {
      records.push(generateRecord());
    }

    // Insert records
    const result = await Record.insertMany(records);
    console.log(`✅ Successfully seeded ${result.length} records`);

    // Display sample records
    console.log('\n📊 Sample Records:');
    console.log('─'.repeat(80));
    const samples = await Record.find({}).limit(10).sort({ created: -1 });
    samples.forEach((record, index) => {
      console.log(`${index + 1}. ${record.name}`);
      console.log(`   ${record.value}`);
      console.log(`   Created: ${record.created.toISOString().split('T')[0]}`);
      console.log('─'.repeat(80));
    });

    // Statistics
    const stats = {
      total: await Record.countDocuments(),
      oldest: await Record.findOne().sort({ created: 1 }),
      newest: await Record.findOne().sort({ created: -1 })
    };

    console.log('\n📈 Database Statistics:');
    console.log(`Total Records: ${stats.total}`);
    console.log(`Oldest Record: ${stats.oldest.created.toISOString().split('T')[0]}`);
    console.log(`Newest Record: ${stats.newest.created.toISOString().split('T')[0]}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seedDatabase();
