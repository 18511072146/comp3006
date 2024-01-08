import { Schema, model } from 'mongoose';

interface IHotel {
  name: string,
  phone: string,
  location: string,
  roomcount: number,
  email: string,
  password: string,
}

const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  roomcount: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Hotel = model<IHotel>('Hotel', hotelSchema);