import express = require('express');
export const router: express.Router = express.Router();
import { ArticleController } from "../controller/article.controller";

router.post('/:book', ArticleController.asFileSave, ArticleController.saveArticle)
      .post('/:book/:filename', ArticleController.asFileSave, ArticleController.saveArticle)
      .put('/:book/:filename', ArticleController.asFileSave, ArticleController.saveArticle)
      .get('/:book', ArticleController.getAticles)
      .put('/:book/:filename/title', ArticleController.modifyTitle)
      .delete('/:directory/:filename', ArticleController.deleteArticle)
      .put('/:book/:articleID/tags/:tag', ArticleController.addTag)
      .delete('/:book/:articleID/tags/:tag', ArticleController.removeTag)
      .put('/:book/:articleID/readCount/top', ArticleController.topArticle)

export const ArticleRouter = router;