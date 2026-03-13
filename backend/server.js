const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/', (req, res) => res.json({ message: "Backend is healthy!" }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

module.exports = app;