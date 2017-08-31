import {Document, model, Model, Schema} from 'mongoose';

const ImageSchema = new Schema({
    filename: String,
    path: String,
    articleID: {type: Schema.Types.ObjectId, ref: 'articles'}
})

export interface Image {
    name: string,
    path: string,
    articleID: string
}

export const ImageModel = model("images", ImageSchema);
