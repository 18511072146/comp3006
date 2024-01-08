import express from 'express';
import 'express-async-errors';
import mongoose, { connection } from 'mongoose';
import { hotelRouter } from './api/hotel';
import { roomRouter } from './api/room';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import { bookRouter } from './api/book';
import expressWs from 'express-ws';

export const app = expressWs(express()).app;

app.use(bodyParser.json());

// Basic settings
const port = process.env.BACKEND_PORT || 3000;

// Mongoose
mongoose.connect(process.env.BACKEND_MONGO_URL || 'mongodb://localhost:27017/table')

app.use(hotelRouter);
app.use(roomRouter);
app.use(bookRouter);

// Error handling
app.use(errorHandler)

// WebSocket
var connections: import("ws")[] = []
app.ws('/ws', (ws, req) => {
    connections.push(ws);

    ws.on('message', (message) => {
        connections.forEach((connection) => {
            connection.send(message);
        })
    })
    
    ws.on('close', () => {
        const index = connections.indexOf(ws);
        if (index !== -1) {
            connections.splice(index, 1);
        }
    })
})

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})