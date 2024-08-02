import express from 'express';
import { generateImageRes, testeRes } from '../controllers/main';
const router = express.Router();

router.get('/generateImage', generateImageRes);
router.get('/teste', testeRes);

module.exports = router;
