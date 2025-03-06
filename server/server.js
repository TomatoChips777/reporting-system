const express = require('express');
const cors = require('cors');
const path = require('path');
const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');
const app = express();

// app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

const port = 5000;

app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
