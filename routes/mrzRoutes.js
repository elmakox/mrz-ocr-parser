const express = require('express');
const { parseMRZ } = require('../controllers/mrzController');
const upload = require('../middleware/multerConfig');

const router = express.Router();

// Route pour soumettre une image de passeport
router.post('/parse-mrz', upload.single('passport'), parseMRZ);

module.exports = router;
