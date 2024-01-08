import express from "express";
import { Hotel } from "../model/Hotel";
import { compareSync, hashSync } from "bcrypt-ts";


const router = express.Router();

// Get hotel list
router.get('/api/hotels', async (req, res) => {
    const hotelList = await Hotel.find().lean();
    res.json(hotelList);
})

// Get hotel detail
router.get('/api/hotel', async (req, res) => {
    const hotelId = req.query.id as string;
    const hotel = await Hotel.findOne({ _id: hotelId }).lean();
    res.json(hotel);
})

// Create new hotel (Sign up)
router.post('/api/hotel', async (req, res) => {
    let newHotel = new Hotel(req.body);

    const existed = await Hotel.findOne({
        email: newHotel.email
    });
    if (existed) {
        res.status(400).send("Email existed.");
        return;
    }

    newHotel.password = hashSync(newHotel.password);

    // ...
    await newHotel.validate();
    newHotel = await newHotel.save()

    res.json(newHotel);
})

//Delete a hotel
router.post('/api/hotel/delete', async (req, res) => {
    const { email, password } = req.body;
    const hotel = await Hotel.findOne({
        email: email
    });
    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (!compareSync(password, hotel.password)) {
        res.status(401).send("Password incorrect.")
        return;
    }

    await hotel.deleteOne();
    res.send("Hotel deleted.");
})

// Login
router.post('/api/hotel/login', async (req, res) => {
    const email: string | null = req.body.email;
    const password: string | null = req.body.password;

    if (!email || !password) {
        res.status(400).send("Bad request.")
        return;
    }

    const hotel = await Hotel.findOne({
        email: email
    });

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (compareSync(password, hotel.password)) {
        res.json(hotel);
        return;
    } else {
        res.status(401).send("Password incorrect.")
    }

})

// Modify hotel
router.put('/api/hotel', async (req, res) => {
    const hotelId = req.query.id as string;
    const hotel = await Hotel.findOne({ _id: hotelId });
    const password = req.query.password as string;

    if (!hotel) {
        res.status(404).send("Hotel not found.");
        return;
    }

    if (!compareSync(password, hotel.password)) {
        res.status(401).send("Password incorrect.")
        return;
    }

    await Hotel.findOneAndUpdate({ _id: hotelId }, req.body);
    
    res.json(hotel);
})

export { router as hotelRouter };