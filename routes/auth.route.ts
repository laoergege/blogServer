import express = require('express');
export const router: express.Router = express.Router();
import { AuthController } from "../controller/auth.controller";
import result from "../result";

router.post('/', AuthController.loginAuth);
router.get('/token', AuthController.tokenAuth, function (req, res, next) {
    res.json(result.TOKEN.SUCCESS);
})

export const AuthRouter = router;
