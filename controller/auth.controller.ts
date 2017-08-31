import { NextFunction, Request, Response } from "express";
import { HostModel, IHost } from "../model/host.model";
import result from "../result";
import jwt = require('jsonwebtoken');
import md5 = require("blueimp-md5");
import config from "../blog-server-config";

export class AuthController {

    /**
     * 登录验证
     * @param {username, password} req 
     * @param res 
     * @param next 
     */
    static async loginAuth(req: Request, res: Response, next: NextFunction) {
        let body = req.body;

        let people = { name: body.name, pass: md5(body.pass) };

        let host = await HostModel.findOne();

        if (people.name != host.name && people.pass != host.pass) {
            res.status(401);
            res.json(result.LOGIN.FAIL);
        } else {
            //设置 token
            const token = jwt.sign({
                id: host._id,
                exp: Math.floor(Date.now() / 1000) + config.TOKEN.time
            }, config.TOKEN.jwtTokenSecret);

            (result.LOGIN.SUCCESS.data as any) = {
                host: host,
                token: 'Bearer ' + token
            }

            res.json(result.LOGIN.SUCCESS);
        }
    }

    /**
     * token 验证
     * @param req 
     * @param res 
     * @param next 
     */
    static async tokenAuth(req: Request, res: Response, next: NextFunction) {
        if (req.header('Authorization')) {
            let token: string = req.header('Authorization').substring(7);

            try {
                let resolvedToken = jwt.verify(token, config.TOKEN.jwtTokenSecret);

                // 保存 用户 ID 在此次请求中
                req.userid = resolvedToken.id;

            } catch (error) {
                res.status(401);
                res.json(result.TOKEN.FAIL);
                return;
            }
 
            next();
        }
    }
}