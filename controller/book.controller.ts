import { NextFunction, Request, Response } from "express";
import { BookModel, IBook } from "../model/markbook.model";
import result from "../result";

export class BookController {

    /**
     * 获取 markbooks
     * @param req 
     * @param res 
     * @param next 
     */
    static async getBooks(req: Request, res: Response, next: NextFunction) {
        let books = await BookModel.find({}, { _id: true, bookname: true });

        (result.MARKBOOKS.BOOKSNAME.data as any) = books;

        res.json(result.MARKBOOKS.BOOKSNAME);
    }

    /**
     * 添加文集
     * @param req 
     * @param res 
     * @param next 
     */
    static async addBook(req: Request, res: Response, next: NextFunction) {
        let bookname = req.body.bookname;
        let book = await BookModel.create({ bookname: bookname });

        (result.MARKBOOKS.ADDBOOK.data as any) = { _id: book._id, bookname: book.bookname };

        res.json(result.MARKBOOKS.ADDBOOK);
    }

    /**
     * 删除文集
     * @param req 
     * @param res 
     * @param next 
     */
    static async delBook(req: Request, res: Response, next: NextFunction) {
        let bookID = req.params.id;
        await BookModel.remove({ _id: bookID });

        res.json(result.MARKBOOKS.DELBOOK);
    }

    /**
     * 修改文集
     * @param req 
     * @param res 
     * @param next 
     */
    static async modifyBook(req: Request, res: Response, next: NextFunction) {
        let book = req.body.book;

        let ubook = await BookModel.findByIdAndUpdate(book._id, { bookname: book.bookname }, { new: true });

        (result.MARKBOOKS.UPDATEBOOK.data as any) = { _id: ubook._id, bookname: ubook.bookname };

        res.json(result.MARKBOOKS.UPDATEBOOK);
    }
}