const express           = require('express');
const cors              = require('cors');
const connectDB         = require('./config/db');
require('./models/index');
const routes            = require('./routes/index');
const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// Routes
app.use('/api', routes);

module.exports = app;