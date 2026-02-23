require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const port = process.env.PORT || 5000;

const mongoDB = require('./db');
mongoDB();

app.use(cors());
app.use(express.json());

// Make io accessible in routes via req.app.get('io')
app.set('io', io);

app.use('/api', require('./routes/CreateUser'));
app.use('/api', require('./routes/DisplayData'));
app.use('/api', require('./routes/OrderData'));
app.use('/api', require('./routes/Payment'));

app.get('/', (req, res) => res.send('TasteYum API running'));

// Each user joins a room with their email so we can emit directly to them
io.on('connection', (socket) => {
    socket.on('join', (email) => {
        if (email) {
            socket.join(email);
            console.log(`Socket joined room: ${email}`);
        }
    });
});

server.listen(port, () => {
    console.log(`TasteYum app listening on port: ${port}`);
});
