require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const connectRoutes = require('./routes/connectRoutes');
const cookieParser = require('cookie-parser');

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend URL, exact — no '*' allowed with credentials
  credentials: true,
}));
app.use(cookieParser());


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/connect', connectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));