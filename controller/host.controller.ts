import { NextFunction, Request, Response } from "express";
import { HostModel, IHost } from "../model/host.model";
import result from "../result";

export class HostController {

    /**
     * 获取 host 信息
     * @param req 
     * @param res 
     * @param next 
     */
    static async getHostInfo(req: Request, res: Response, next: NextFunction) {
        let body = req.body;
        
        let host = await HostModel.findOne();

        result.HOST_INFO.data = host;

        res.json(result.HOST_INFO);
    }
}