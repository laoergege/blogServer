import express = require('express');
export const router: express.Router = express.Router();
import { BookController } from "../controller/book.controller";
import { ArticleRouter } from "./article.route";
import { ArticleController } from "../controller/article.controller";

router.get('/', BookController.getBooks)
      .post('/', BookController.addBook)
      .delete('/:id', BookController.delBook)
      .put('/', BookController.modifyBook)
      // .get('/all', ArticleController.getALL)
      .use(ArticleRouter)

export const BookRoute = router;
