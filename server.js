const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const multer = require('multer');
const xlsx = require('node-xlsx');


const secretKey = 'your-secret-key'; // Replace with your own secret key

// Dummy users data
const users = [
  { id: 1, employeeId: '2134', fname: 'Aakash', lname: 'Singh', email: 'aakashskilldevelopment@gmail.com', username: 'Akubhai', password: 'password1', role: 'user', number: '1234567890', address: '123 Street', pincode: '12345', city: 'City1', dob: '1990-01-01' },
  { id: 2, employeeId: '2135', fname: 'Aman', lname: 'pal', email: 'skilldevelopment@gmail.com', username: 'SinghJi', password: 'password1', role: 'admin', number: '9876543210', address: '456 Avenue', pincode: '54321', city: 'City2', dob: '1985-05-05' },
  { id: 3, employeeId: '2136', fname: 'Ankit ', lname: 'Gupta', email: 'amandevelopment@gmail.com', username: 'aman', password: 'aman', role: 'admin', number: '5555555555', address: '789 Road', pincode: '67890', city: 'City3', dob: '1995-12-31' },
  { id: 4, employeeId: '2133', fname: 'Aakash', lname: 'Sekh', email: 'aakashskilldevelopment@gmail.com', username: 'Akubhai', password: 'password1', role: 'user', number: '1234567890', address: '123 Street', pincode: '12345', city: 'City1', dob: '1990-01-01' },
  { id: 5, employeeId: '2137', fname: 'Sonali', lname: 'Singh', email: 'skilldevelopment@gmail.com', username: 'SinghJi', password: 'password1', role: 'admin', number: '9876543210', address: '456 Avenue', pincode: '54321', city: 'City2', dob: '1985-05-05' },
  { id: 6, employeeId: '2138', fname: 'Sanjeet ', lname: 'Kumar', email: 'amandevelopment@gmail.com', username: 'aman', password: 'aman', role: 'admin', number: '5555555555', address: '789 Road', pincode: '67890', city: 'City3', dob: '1995-12-31' },
  { id: 7, employeeId: '2139', fname: 'Shreya ', lname: 'Singh', email: 'Shreya@gmail.com', username: 'Shreya210', password: '123@Shreya', role: 'moderator', number: '7878787878', address: '789 Road', pincode: '67890', city: 'muzaffarpur', dob: '1995-12-31' },
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post('/api/import', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.parse(filePath);
    const importedData = workbook[0].data;
    const newUsers = [];
    for (let i = 1; i < importedData.length; i++) {
      const [employeeId, fname, lname, email, username, password, role, number, address, pincode, city, dob] = importedData[i];
      const existingUser = users.find((user) => user.email === email);
      if (!existingUser) {
        const newUser = {
          id: users.length + 1,
          employeeId: employeeId || '',
          fname: fname || '',
          lname: lname || '',
          email: email || '',
          username: username || '',
          password: password || '',
          role: role || '',
          number: number || '',
          address: address || '',
          pincode: pincode || '',
          city: city || '',
          dob: dob || ''
        };
        newUsers.push(newUser);
        users.push(newUser);
      }
    }

    res.json({ message: 'Data imported successfully', importedData, newUsers });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data' });
  }
});

app.post('/api/register', (req, res) => {
  const { eid, fname, lname, dob, number, email, gender, username, password, role } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    eid,
    fname: fname,
    lname: lname,
    dob,
    number: number,
    email,
    username: username,
    password,
    role: role,
    address: '',
    pincode: '',
    city: '',
  };
  users.push(newUser);
  const accessToken = jwt.sign(
    { sub: newUser.id, username: newUser.username, role: newUser.role, fname: newUser.fname, lname: newUser.lname, email: newUser.email },
    secretKey,
    { expiresIn: '1h' }
  );

  res.json({ accessToken });
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const accessToken = jwt.sign(
    { sub: user.id, username: user.username, role: user.role, fname: user.fname, lname: user.lname, email: user.email },
    secretKey,
    { expiresIn: '1h' }
  );

  res.json({ accessToken });
});



app.put('/api/users/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const { fname, lname, email, number, address, pincode, city, dob } = req.body;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.fname = fname;
  user.lname = lname;
  user.email = email;
  user.number = number;
  user.address = address;
  user.pincode = pincode;
  user.city = city;
  user.dob = dob;

  res.json({ message: 'User data updated successfully', user });
});

app.get('/api/userData', authenticateToken, (req, res) => {
  const { sub, username, role, fname, lname, email, number, pincode, address, dob, city } = req.user;
  const allUserData = users.map(user => {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      number: user.number,
      pincode: user.pincode,
      address: user.address,
      dob: user.dob,
      city: user.city
    };
  });
  const loggedInUserData = allUserData.find(user => user.id === sub);
  res.json({ loggedInUserData, allUserData });
});

app.get('/api/adminData', authenticateToken, (req, res) => {
  const { sub, username, role, fname, lname, email, number, pincode, address, dob, city } = req.user;
  if (role !== 'admin' && role !== 'moderator') {
    return res.status(401).json({ message: 'Access Forbidden' });
  }
  const allUserData = users.map(user => {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      number: user.number,
      pincode: user.pincode,
      address: user.address,
      dob: user.dob,
      city: user.city
    };
  });
  const loggedInUserData = allUserData.find(user => user.id === sub);
  res.json({ loggedInUserData, allUserData });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
