import express = require('express');
const router: express.Router = express.Router();
import config from "../blog-server-config";

router.all('*', (req, res, next) => {

    // Set Header
    const allowedOrigins = config.ORIGINS;
    const origin = req.headers.origin || '';
    if (allowedOrigins.indexOf(origin) != -1 || origin.indexOf('localhost') != -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    };
    res.header("Access-Control-Allow-Headers", "authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By", 'Nodepress 1.0.0');

    // OPTIONS
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
        res.end();
    }else{
        next('route');
    }
});

import { AuthRouter } from "./auth.route";
router.use('/auth', AuthRouter);

// 博客 客户端 获取所有文集文章接口
import { ArticleController } from "../controller/article.controller";
router.get('/markbooks/articles/all', ArticleController.getALL);

import { AuthController } from "../controller/auth.controller";
import { BookRoute } from "./markbooks.route";
import { UploaderRoute } from "./upload.route";
router.use(AuthController.tokenAuth)
      .use('/markbooks', BookRoute)
      .use('/upload', UploaderRoute)


export const Router = router;