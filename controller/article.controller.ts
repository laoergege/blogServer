import { NextFunction, Request, Response } from "express";
import result from "../result";
import { ArticlesModel, IArticle } from "../model/article.model";
import { BookModel } from "../model/markbook.model";
import config from "../blog-server-config";
import md5 = require("blueimp-md5");
const path = require('path');

const fs = require('fs-extra');

export class ArticleController {

    /**
     * 把文章内容保存为文件
     * @param req 
     * @param res 
     * @param next 
     */
    static async asFileSave(req: Request, res: Response, next: NextFunction) {
        let content = req.body.content;
        let p = req.body.directory;

        if (!req.body.filename) {
            req.body.filename = md5(Date.now().toString());
        }

        if (req.method.toUpperCase() != 'PUT') {
            fs.outputFileSync(path.join(config.STATIC, p, req.body.filename + '.md'), content);
            fs.outputFileSync(path.join(config.STATIC, p, req.body.filename + '.save.md'), content);
        } else {
            fs.outputFileSync(path.join(config.STATIC, p, req.body.filename + '.save.md'), content);
        }


        next();
    }

    /**
     * 记录 文章
     * @param req 
     * @param res 
     * @param next 
     */
    static async saveArticle(req: Request, res: Response, next: NextFunction) {
        let data = req.body;

        let doc = await ArticlesModel.findOneAndUpdate({ title: data.title }, {
            title: data.title,
            filename: data.filename,
            directory: data.directory,
            create_at: data.create_at,
            release: data.release,
            wordCount: data.wordCount || 0,
            bookID: data.bookID
        }, { upsert: true, new: true });

        (result.ARTICLES.SAVE_SUCC.data as any) = doc;

        res.json(result.ARTICLES.SAVE_SUCC);
    }

    /**
     * 获取 文集所有文章
     * @param req 
     * @param res 
     * @param next 
     */
    static async getAticles(req: Request, res: Response, next: NextFunction) {
        let bookID = req.params.book;

        let as = await ArticlesModel.find({ bookID: bookID }, { __v: false });

        (result.ARTICLES.GET_SUCC.data as any) = as;

        res.json(result.ARTICLES.GET_SUCC);
    }

    /**
     * 修改 文章标题
     * @param req 
     * @param res 
     * @param next 
     */
    static async modifyTitle(req: Request, res: Response, next: NextFunction) {
        try {
            let { title, _id } = req.body;

            await ArticlesModel.findOneAndUpdate({ _id: _id }, { $set: { title: title } });

            res.json(result.ARTICLES.UPDATE_TITLE_SUCC);
        } catch (error) {
            res.json(result.ARTICLES.UPDATE_TITLE_FAIL);
        }
    }

    /**
     * 删除 文章
     * @param req 
     * @param res 
     * @param next 
     */
    static async deleteArticle(req: Request, res: Response, next: NextFunction) {
        try {
            let filename = req.params.filename;

            let directory = req.params.directory;
            // 删除 文章
            await ArticlesModel.remove({filename: filename});

            // 删除 文件
            fs.removeSync(path.join(config.STATIC, 'books', directory, filename+'.md'));
            fs.removeSync(path.join(config.STATIC, 'books', directory, filename+'.save.md'));

            res.json(result.ARTICLES.DELETE_FILE_SUCC);
        } catch (error) {
            res.status(500);
            res.json(result.ARTICLES.DELETE_FILE_FAIL);
        }
    }      
    
    /**
     * 获取所有文集及其所有文章
     * @param req 
     * @param res 
     * @param next 
     */
    static async getALL(req: Request, res: Response, next: NextFunction) {
        try {
            let docs =  await ArticlesModel.find().populate("bookID").sort({create_at: -1});

            res.json(docs)
        } catch (error) {
            res.status(500);
        }       
    }
}