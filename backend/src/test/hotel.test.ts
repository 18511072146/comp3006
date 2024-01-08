import { expect, test } from 'vitest'
import supertest from 'supertest'
import { app } from '../app'

const testServer = supertest(app);
let createdHotel: {
    email: any; _id: string;
};
let createdRoom: { _id: any; };

test('GET /api/hotels', async () => {
    const response = await testServer.get("/api/hotels");
    expect(response.statusCode).toBe(200);
})

test('POST /api/hotel', async () => {
    const response = await testServer.get("/api/hotels");
    const newHotel = {
        "name": "name",
        "phone": "phone",
        "location": "location",
        "roomcount": 12,
        "email": "test@email.com",
        "password": "password"
    }
    const createHotelResponse = await testServer.post("/api/hotel")
        .send(newHotel)
        .set("Content-Type", "application/json");
    expect(createHotelResponse.statusCode).toBe(200);
    createdHotel = createHotelResponse.body;
})

test('POST /api/hotel/login', async () => {
    const loginResponse = await testServer.post("/api/hotel/login")
        .send({
            "email": "test@email.com",
            "password": "password"
        });
})

test('GET /api/hotel', async () => {
    const hoteldetail = await testServer.get(`/api/hotel?id=${createdHotel._id}`);
    expect(hoteldetail.body._id).toBe(createdHotel._id);
})

test('PUT /api/hotel', async () => {
    const newHotelname = "new name";
    const modifyHotelResponse = await testServer.put(`/api/hotel?id=${createdHotel._id}&password=${"password"}`)
        .send({ name: newHotelname })
        .set("Content-Type", "application/json")
        ;
    expect(modifyHotelResponse.statusCode).toBe(200);
    const hoteldetail = await testServer.get(`/api/hotel?id=${createdHotel._id}`);
    expect(hoteldetail.body.name).toBe(newHotelname);
})

// Test create room
test('POST /api/room', async () => {
    const createRoomResponse = await testServer.post("/api/room")
        .send({
            "email": "test@email.com",
            "password": "password",
            "roomId": 100,
            "roomType": "roomType",
            "price": 1,
            "available": true,
        })
        .set("Content-Type", "application/json");
    createdRoom = createRoomResponse.body;
    expect(createRoomResponse.status).toBe(200);
})

// Test get rooms
test('GET /api/room', async () => {
    const getRoomResponse = await testServer.get(`/api/room?id=${createdHotel._id}`)
    expect(getRoomResponse.statusCode).toBe(200);
    expect((getRoomResponse.body as any[])[0].hotelId).toBe(createdHotel._id);
    expect((getRoomResponse.body as any[])[0].roomId).toBe(100);
    expect((getRoomResponse.body as any[])[0].roomType).toBe("roomType");
})

// Test book a room
test('POST /api/book', async () => {
    const bookRoomResponse = await testServer.post("/api/book").send({
        "name": "name",
        "checkInDate": Date(),
        "checkOutDate": Date(),
        "roomId": createdRoom._id
    })
        .set("Content-Type", "application/json");
    expect(bookRoomResponse.statusCode).toBe(200);
})

// Delete a room
test('POST /api/room/delete', async () => {
    const deleteRoomResponse = await testServer.post(`/api/room/delete?id=${createdRoom._id}`)
        .send({
            "email": createdHotel.email,
            "password": "password"
        })
        .set("Content-Type", "application/json");
    
    expect(deleteRoomResponse.statusCode).toBe(200);
})

test('POST /api/hotel/delete', async () => {
    const deleteHotelResponse = await testServer.post("/api/hotel/delete")
        .send({
            email: "test@email.com",
            password: "password"
        })
        .set("Content-Type", "application/json");
    expect(deleteHotelResponse.status).toBe(200);
})