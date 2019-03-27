const jp = require('jsonpath');
const { returnErrorResponse } = require('../controller/util/helperFunctions');
const { sendEmailUsingSendGrid } = require('./sendGridService');
const { sendEmailUsingMailGun } = require('./mailgunService');

exports.mailService = async (req, res, next) => {
    const { body } = req;

    const senderEmail = jp.value(body, '$.senderEmail');
    const recipients = jp.value(body, '$.recipients');
    const ccRecipients = jp.value(body, '$.ccRecipients');
    const bccRecipients = jp.value(body, '$.bccRecipients');
    const subject = jp.value(body, '$.subject');
    const emailBody = jp.value(body, '$.emailBody');

    try {
        const mailGunResponseCode = await sendEmailUsingMailGun(senderEmail, recipients, subject, emailBody, ccRecipients, bccRecipients);
        
        //if mail gun service is down or errors out, try sendGrid
        if (mailGunResponseCode !== 200) {
            const sendGridResponse = await sendEmailUsingSendGrid(senderEmail, recipients, subject, emailBody, ccRecipients, bccRecipients); 
            //if sendGrid succeeds, return success reponse to user
            return handleResponse(sendGridResponse, res);
        }
        //if mail gun succeeds, return success response to the user
        return handleResponse(mailGunResponseCode, res);

    } catch (err) {
        //if any of the above throws an exception
        return handleResponse(500, res);
    }
}

const handleResponse = (responseCode, res) => {

    switch (responseCode) {

        case 200:

        case 202: return res.json({message: 'Email Sent Successfully'});

        case 400: return returnErrorResponse(400, 'Bad Request', res);
        
        case 401: return returnErrorResponse(401, 'UnAuthorized', res);

        case 404: return returnErrorResponse(404, 'NotFound', res);

        case 500:

        case 502:

        case 503: 

        case 504: return returnErrorResponse(500, 'Email Service is down. Sorry for inconvinience', res);

        default: return returnErrorResponse(responseCode, 'Error', res)
    }

}