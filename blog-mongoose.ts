import mongoose = require("mongoose");
mongoose.Promise = global.Promise
import config from "./blog-server-config";


//数据库
export function connect(){

    //连接数据库
    mongoose.connect(config.MONGODB.uri,
    {
        user: config.MONGODB.username,
        pass: config.MONGODB.password
    },
    (error: any) => {
        if(error){
             console.log('数据库连接失败!', error);
        }
        else{
            console.log('数据库连接成功!');
        }
    })
}