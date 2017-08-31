/// <reference path="../typings/index.d.ts" />
import {Document, model, Model, Schema} from 'mongoose';

const BookSchema = new Schema({
    bookname: { type: String, required: true, index: true },
})

export interface IBook extends Document {
    bookname: string
}

export const BookModel: Model<IBook> = model('book', BookSchema);

// new BookModel({bookname: 'Angular'}).save(() => {
//     console.log(1)
// });

// new BookModel({bookname: 'Vue'}).save(() => {
//     console.log(1)
// });

// new BookModel({bookname: 'JavaScript'}).save(() => {
//     console.log(1)
// });

