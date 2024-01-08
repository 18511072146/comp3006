import express from "express";
import { Book } from "../model/Book";
import { Room } from "../model/Room";

const router = express.Router();

// Book a room
router.post('/api/book', async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.validate();

    const room = await Room.findOne({
        _id: newBook.roomId
    })

    if (!room) { throw new Error("No such room!"); }

    if (!room.available) { throw new Error("Room not available."); }

    await newBook.save();

    room.available = false;
    await room.save();

    res.send("ok");
})

export { router as bookRouter };