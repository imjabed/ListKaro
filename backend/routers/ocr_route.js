import express from 'express';
import multer from 'multer';
import { extractProductDataFromImage } from '../controlers/ocr.controler.js';
import { bulkUploadProducts } from '../controlers/bulkUpload.controler.js';
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-ocr', verifyToken, upload.single('image'), extractProductDataFromImage);
router.post('/bulk-upload', verifyToken, bulkUploadProducts);

export default router;
