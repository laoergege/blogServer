import {Document, model, Model, Schema} from 'mongoose';

const ArticleSchema = new Schema({
    title: { type: String, required: true, index: true },
    filename: { type: String, index: true },
    directory: { type: String, required: true },
    release: Boolean,  
    create_at: Date,
    wordCount: Number,
    readCount: {type: Number, default:0},
    favs: {type: Number, default:0},
    bookID: {type: Schema.Types.ObjectId, ref: 'book'}
});

export interface IArticle extends Document{
    title: string;
    filename: string;
    path: string;
    relase: boolean;
    create_at: Date;
    wordCount: number,
    readCount: number,
    favs: number
}

ArticleSchema.pre('save',function (next) {
    if(!this.create_at){
        this.create_at = new Date();
    }
    next(); 
})

//创建Articles模型
export const ArticlesModel = model("article", ArticleSchema);