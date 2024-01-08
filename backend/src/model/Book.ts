import { Date, Schema, model } from 'mongoose';

interface IBook {
  name: string,
  checkInDate: Date,
  checkOutDate: Date,
  roomId: string
}

const bookSchema = new Schema<IBook>({
  name: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  roomId: { type: String, required: true },
});

export const Book = model<IBook>('Book', bookSchema);