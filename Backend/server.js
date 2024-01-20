const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const pollRoutes = require('./routes/polls');
const voteRoutes = require('./routes/votes');
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);

// Error Handling (move this middleware below your route handlers)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
