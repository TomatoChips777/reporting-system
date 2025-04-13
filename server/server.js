const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');
const analytics = require('./routes/analytics');
const notifications = require('./routes/notifications');
const lostandfound = require('./routes/lost-found-reports');
// const unifiedReports = require('./routes/unified-reports');
const messages = require('./routes/messages');
const maintenanceReports = require('./routes/maintenance-reports');
const incidentReports = require('./routes/incident-reports');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",

        ],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

// Pass the io instance to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notifications);
app.use('/api/lostandfound', lostandfound);
app.use('/api/analytics', analytics);
// app.use('/api/unified-reports', unifiedReports);
app.use('/api/messages', messages);
app.use('/api/maintenance-reports', maintenanceReports);
app.use('/api/incident-reports', incidentReports);
const port = 5000;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

// WebSocket connection event
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
