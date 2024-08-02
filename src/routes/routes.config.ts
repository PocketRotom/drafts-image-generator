import express from 'express';
const router = express.Router();
import { generateImageRes, testeRes } from '../controllers/main';

router.get('/generateImage', generateImageRes);
router.get('/teste', testeRes);

module.exports = router;
