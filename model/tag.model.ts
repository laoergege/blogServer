import {Document, model, Model, Schema} from 'mongoose';

const TagSchema = new Schema({
    tag: String
});

export const TagModel = model("tags", TagSchema);