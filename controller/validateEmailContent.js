const emailValidator = require('email-validator');
const jp = require('jsonpath');

const { returnErrorResponse } = require('./util/helperFunctions');

const validateEmailAddresses = emailAddresses => emailAddresses.map(emailAddress => {
    if (!emailValidator.validate(emailAddress)) {
        throw new Error(`Invalid Email Address provided: ${emailAddress}`);
    }
});

exports.validateEmailContent = async (req, res, next) => {

    const { body } = req;

    const senderEmail = jp.value(body, '$.senderEmail') || undefined;
    const recipients = jp.value(body, '$.recipients') || undefined;
    const ccRecipients = jp.value(body, '$.ccRecipients') || [];
    const bccRecipients = jp.value(body, '$.bccRecipients') || [];
    const subject = jp.value(body, '$.subject') || undefined;
    const emailBody = jp.value(body, '$.emailBody') || undefined;

    if (!senderEmail) {
        return returnErrorResponse(422, 'Sender Email is not provided', res);
    }

    if (!recipients) return returnErrorResponse(422, 'Recipient email(s) is not provided', res);

    if (!subject) return returnErrorResponse(422, 'Subject Field Cannot Be Blank', res);

    if (!emailBody) return returnErrorResponse(422, 'Email Body Cannot Be Blank', res);

    let emailList = [];
    emailList = emailList.concat(senderEmail, recipients);

    if (ccRecipients.length > 0) {

        if (recipients.some(recipient => ccRecipients.includes(recipient))) {
            return returnErrorResponse(422, 'Emails are duplicated in recipients list and CC List', res);
        }

        if ((new Set(ccRecipients)).size !== ccRecipients.length) {
            return returnErrorResponse(422, 'There are duplicate Emails in the CC list', res);
        }
    }

    if (bccRecipients.length > 0) {

        if (recipients.some(recipient => bccRecipients.includes(recipient))) {
            return returnErrorResponse(422, 'Emails are duplicated in recipients list and BCC List', res);
        }

        if (ccRecipients.some(ccRecepient => bccRecipients.includes(ccRecepient))) {
            return returnErrorResponse(422, 'Emails are duplicated in CC and BCC List', res);
        }

        if ((new Set(bccRecipients)).size !== bccRecipients.length) {
            return returnErrorResponse(422, 'There are duplicate Emails in the BCC list', res);
        }
    }

    try {
        validateEmailAddresses(emailList);
    } catch (err) {
        returnErrorResponse(422, err.message, res);
    }
    next();
}

