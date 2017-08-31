import express = require('express');
export const router: express.Router = express.Router();
import { ArticleController } from "../controller/article.controller";

router.post('/:book', ArticleController.asFileSave, ArticleController.saveArticle)
      .post('/:book/:filename', ArticleController.asFileSave, ArticleController.saveArticle)
      .put('/:book/:filename', ArticleController.asFileSave, ArticleController.saveArticle)
      .get('/:book', ArticleController.getAticles)
      .put('/:book/:filename/title', ArticleController.modifyTitle)
      .delete('/:directory/:filename', ArticleController.deleteArticle)

export const ArticleRouter = router;