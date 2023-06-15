const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const secretKey = 'your-secret-key'; // Replace with your own secret key

// Dummy users data
const users = [
  { id: 1, employeeId:'2134',name:'Aakash', email:'aakashskilldevelopment@gmail.com', username: 'Akubhai', password: 'password1', role: 'user' },
  { id: 2,name:'Singh', email:'skilldevelopment@gmail.com', username: 'SinghJi', password: 'password1', role: 'admin' },
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find user based on username and password
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate access token
  const accessToken = jwt.sign(
    { sub: user.id, username: user.username, role: user.role, name:user.name, email:user.email },
    secretKey,
    { expiresIn: '1h' }
  );

  res.json({ accessToken });
});

// Protected route for user data
app.get('/api/userData', authenticateToken, (req, res) => {
  // Retrieve user data from the token
  const { sub, username, role, name, email } = req.user;

  res.json({ id: sub, username, role, name, email });
});

// Protected route for admin data
app.get('/api/adminData', authenticateToken, (req, res) => {
  // Retrieve user data from the token
  const { sub, name, email, username, role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden' });
  }

  // Dummy admin data
  const adminData = { name: name, role, email, username };

  res.json(adminData);
});

// Middleware to authenticate the access token
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

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
