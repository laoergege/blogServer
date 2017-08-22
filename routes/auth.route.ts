import express = require('express');
export const router: express.Router = express.Router();
import { AuthController } from "../controller/auth.controller";

router.post('/', AuthController.loginAuth);

export const AuthRouter = router;
