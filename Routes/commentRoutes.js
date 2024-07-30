const express = require('express');
const { getComments, createComment } = require('../Controllers/commentController');

const router = express.Router();

router.get('/', getComments);
router.post('/', createComment);

module.exports = router;
