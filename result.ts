export default {
    LOGIN: {
        FAIL: { code: 1, message: '登录验证失败', data: null },
        SUCCESS: { code: 2, message: '登录验证成功', data: null }
    },
    TOKEN: {
        FAIL: { code: 3, message: 'token验证失败', data: null },
        SUCCESS: { code: 4, message: 'token验证成功', data: null }
    },
    HOST_INFO: { code: 5, message: '获取 host 资料成功', data: null },
    
    MARKBOOKS: {
        BOOKSNAME: { code: 6, message: '获取文集成功', data: null },
        ADDBOOK: { code: 7, message: '添加文集成功', data: null },
        DELBOOK: { code: 8, message: '删除文集成功', data: null },
        UPDATEBOOK: { code: 9, message: '更新文集成功', data: null }
    },

    ARTICLES: {
        SAVE_SUCC: { code: 10, message: '保存文章成功', data:null},
        GET_SUCC: { code: 11, message: '获取文章成功', data:null},  
        UPDATE_TITLE_SUCC: { code: 14, message: '修改标题成功', data:null},
        UPDATE_TITLE_FAIL: { code: 15, message: '修改标题失败', data:null},
        DELETE_FILE_FAIL: { code: 16, message: '删除文章失败', data:null},
        DELETE_FILE_SUCC: { code: 17, message: '删除文章成功', data:null}          
    },

    IMAGE: {
        FAIL: { code: 12, message: '图片上传失败', data: null },
        SUCCESS: { code: 13, message: '图片上传成功', data: null }
    },

    ERROR: { code: 500, message: '服务器出错了!', data: null }
}