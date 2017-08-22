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
                token: token
            }

            res.json(result.LOGIN.SUCCESS);
        }
    }
}