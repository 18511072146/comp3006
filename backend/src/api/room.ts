import express from "express";
import { Room } from "../model/Room";
import { Book } from "../model/Book";
import { Hotel } from "../model/Hotel";
import { compareSync } from "bcrypt-ts";

const router = express.Router();

// Get rooms by hotel id
router.get('/api/room', async (req, res) => {
    const hotelId = req.query.id as string;
    const roomList = await Room.find({ hotelId: hotelId }).lean();
    res.json(roomList);
})

// router.get('/api/hotels/room', async (req, res) => {
//     const roomid = req.query.id as string;
//     const room = await Room.findOne({ _id: roomid }).lean();
//     res.json(room);
// })

// Edit room information
router.put('/api/room', async (req, res) => {
    const {email, password} = req.body;
    const hotel = await Hotel.findOne({
        email: email
    })

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    compareSync(password, hotel.password);

    const roomId = req.query.id;
    let room = await Room.findOne({ _id: roomId, hotelId: hotel._id });

    if (!room) { throw new Error("No such room!") };

    await Room.updateOne({ _id: roomId }, req.body);
    res.json(await Room.findOne({ _id: roomId }));
})

// Add a new room
router.post('/api/room', async (req, res) => {
    const { email, password } = req.body;
    const hotel = await Hotel.findOne({
        email: email
    });

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (!compareSync(password, hotel.password)) {
        res.status(400).send("Wrong password.");
        return;
    }
    const newRoom = new Room({
        ...req.body, hotelId: hotel._id
    });
    await newRoom.save();
    res.json(newRoom);
})

// Delete room
router.post('/api/room/delete', async (req, res) => {
    const roomId = req.query.id;
    const { email, password } = req.body;
    const hotel = await Hotel.findOne({
        email: email
    });

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (!compareSync(password, hotel.password)) {
        res.status(400).send("Wrong password.");
        return;
    }

    const room = await Room.findOne({ _id: roomId, hotelId: hotel._id });

    if (!room) {
        res.status(404).send("Room not found.");
        return;
    }

    // Delete all book information
    await Book.find({
        roomId: roomId
    }).deleteMany();
    
    await room.deleteOne();    

    res.send("ok");
})

router.post('/api/room/checkout', async (req, res) => {
    const roomId = req.query.id;
    const { email, password } = req.body;
    const hotel = await Hotel.findOne({
        email: email
    });

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (!compareSync(password, hotel.password)) {
        res.status(400).send("Wrong password.");
        return;
    }

    const room = await Room.findOne({ _id: roomId, hotelId: hotel._id });

    if (!room) {
        res.status(404).send("Room not found.");
        return;
    }

    // Delete all book information
    await Book.find({
        roomId: roomId
    }).deleteMany();

    room.available = true;
    await room.save();

    res.json(room);
})

export { router as roomRouter };