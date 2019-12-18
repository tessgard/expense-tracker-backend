const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect Database

connectDB();

// init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the expense tracker API' });
});

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server up and running on ${PORT}`));
