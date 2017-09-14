const path = require('path');

export default {
    MONGODB: {
        uri: 'mongodb://119.29.101.43:27017/blog',
        username: 'blog',
        password: 'blog'
    },
    TOKEN: {
        jwtTokenSecret: 'laeorgege',
        time: 60 * 60 * 24
    },
    ORIGINS: [
        'http://blog.laoergege.cn',
        'http://admin.laoergege.cn',
        'https://blog.laoergege.cn',
        'https://admin.laoergege.cn'        
    ],
    STATIC: path.resolve(__dirname,'public')
}