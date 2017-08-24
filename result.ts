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
    ERROR: { code: 500, message: '服务器出错了!', data: null }
}