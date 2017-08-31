import express = require('express');
const multiparty = require("multiparty");
import result from "../result";
import config from "../blog-server-config";
const path = require("path");
import { ImageModel } from "../model/image.model";

export class FileController {

    /**
     * 保存content-type multipart/form-data 上传的 文件
     * @return 文件url路径数组
     */
    static saveFile(req: express.Request, res: express.Response, next: express.NextFunction) {
        let form = new multiparty.Form({
            uploadDir: path.join(config.STATIC, 'images'), autoFields: true, autoFiles: true
        });

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err)

                res.json(result.IMAGE.FAIL);
            } else {
                // (req as any).files = files;
                let paths = [];
                files.image.forEach(file => {
                    paths.push((file.path as string).split(config.STATIC)[1].replace(/\\/g, "/") as never)
                });
                (result.IMAGE.SUCCESS.data as any) = paths;
                res.json(result.IMAGE.SUCCESS);

                // next();
            }
        });
    }
}

export class ImageController {
    static async saveImg(req: express.Request, res: express.Response, next: express.NextFunction) {
        let files = req.body.files;

        for (let file of files) {
            let f = await ImageModel.create({
                filename: file.fieldName,
                path: (file.path as string).split(config.STATIC)[1].replace("\\","/"),
                articleID: req.body.articleID
            });

            files.push(f);
        }

        (result.IMAGE.SUCCESS.data as any) = files;
        res.json(result.IMAGE.SUCCESS);
    }
}