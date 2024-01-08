import { Schema, model } from 'mongoose';

interface IRoom {
  roomId: number,
  roomType: string,
  hotelId: string,
  price: number,
  available: boolean
}

const roomSchema = new Schema<IRoom>({
  roomId: { type: Number, required: true },
  roomType: { type: String, required: true },
  hotelId: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: true }
});

export const Room = model<IRoom>('Room', roomSchema);