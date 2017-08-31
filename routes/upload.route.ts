import express = require('express');
export const router: express.Router = express.Router();
import { FileController, ImageController } from "../controller/file-controller";

router.post('/images', FileController.saveFile);

export const UploaderRoute = router;