import {Document, model, Model, Schema} from 'mongoose';

const HostSchema = new Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
    signature: String,
    avatar: String
}); 

export interface IHost extends Document {
    name: string,
    pass: string,
    signature: string,
    avatar: string
}

export const HostModel: Model<IHost> = model('Host', HostSchema);

// import md5 = require("blueimp-md5");

// HostModel.create({
//     name: 'laoergege',
//     pass: md5('laoergege'),
//     signature: '改变自己',
//     avatar: ''
// },() => {
//     console.log('host created！')
// })