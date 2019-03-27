const express = require('express');
const router = express.Router();
const { validateEmailContent } = require('../controller/validateEmailContent');
const { mailService } = require('../services/mailService');
const { asyncMiddleware } = require('../controller/util/helperFunctions');


router.post('/', asyncMiddleware(validateEmailContent), asyncMiddleware(mailService));

module.exports = router;
